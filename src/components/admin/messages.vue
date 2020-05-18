<template>
    <div>
        <div class="searchArea">
            <el-select v-model="timeType" placeholder="请选择时间类型" class="searchItem">
                <el-option :label="'创建时间'" :value="'createTime'"></el-option>
                <el-option :label="'更新时间'" :value="'updateTime'"></el-option>
            </el-select>
            <el-date-picker
                    class="searchItem"
                    v-model="timeRange"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    end-placeholder="结束日期">
            </el-date-picker>
            <el-input class="searchItem" style="width: 200px" clearable v-model="senderId" placeholder="发送者ID"/>
            <el-input class="searchItem" style="width: 200px" clearable v-model="receiverId" placeholder="接收者ID"/>


            <el-button @click="getList">查询</el-button>
            <el-button type="danger" v-show="showBatchDelete" @click="batchDelete">
                批量删除
            </el-button>
            <el-button @click="exportExcel">
                导出Excel
            </el-button>
        </div>
        <el-table
                :data="messages"
                border
                @selection-change="handleSelectionChange"
                class="messages">
            <el-table-column
                    type="selection"
                    width="55">
            </el-table-column>
            <el-table-column
                    prop="messageId"
                    label="MessageId"
                    align="center"
                    width="120">
            </el-table-column>

            <el-table-column
                    align="center"
                    label="发送者"
                    width="180">
                <template slot-scope="{row}">
                    <div style="display: flex;align-items: center">
                        <el-avatar :src="row.sender.avatar" style="margin-right: 20px"></el-avatar>
                        <span>{{row.sender.username}}</span>
                    </div>
                </template>
            </el-table-column>


            <el-table-column
                    align="center"
                    label="接收者"
                    width="180">
                <template slot-scope="{row}">
                    <div v-if="row.receiver==null" style="text-align: center">
                        <span>聊天室</span>
                    </div>
                    <div v-else style="display: flex;align-items: center">
                        <el-avatar :src="row.receiver.avatar" style="margin-right: 20px"></el-avatar>
                        <span>{{row.sender.username}}</span>
                    </div>
                </template>
            </el-table-column>

            <el-table-column
                    align="center"
                    prop="description"
                    width="350"
                    label="内容">
                <template slot-scope="{row}">
                    <span :title="row.content">{{row.content|crop(40)}}</span>
                </template>
            </el-table-column>

            <el-table-column
                    prop="createTime"
                    label="发送时间"
                    align="center"
                    width="170">

                <template slot-scope="{row}">
                    <span>{{row.createTime|formatDate}}</span>
                </template>
            </el-table-column>


            <el-table-column
                    label="操作"
                    align="center"
                    width="200">

                <template slot-scope="{row}">
                    <el-button slot="reference" type="danger" @click="singleDelete(row.messageId)">删除</el-button>
                    <!--                    <el-button type="warning" @click="freezeUser(row.userId)">冻结</el-button>-->
                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="query.page" :limit.sync="query.size"
                    @pagination="getList"/>
    </div>
</template>

<script>
    import * as api from '@/common/request'
    import message from "@/common/message";
    import pagination from "@/components/pagination";
    import {export_json_to_excel} from "@/vendor/Export2Excel";


    export default {
        name: "messages",
        mixins: [message],
        components: {pagination},
        data() {
            return {
                messages: [],
                selectMessages: [],
                query: {
                    page: 1,
                    size: 6
                },
                total: 0,
                timeType: 'createTime',
                timeRange: [],
                senderId: '',
                receiverId: '',

            }
        },
        computed: {
            showBatchDelete() {
                return this.selectMessages.length > 0
            }
        },
        methods: {
            batchDelete(userId) {
                this.confirm('你确定要删除选中的聊天记录吗', () => {
                    let messageIds = this.selectMessages.map(message => message.messageId).join(",");

                    api.deleteMessages(messageIds).then(res => {
                        if (res.data.success) {
                            this.getList()
                        }
                    })
                })
            },
            singleDelete(messageId) {
                this.confirm('你确定要删除该聊天记录吗', () => {
                    api.deleteMessage(messageId).then(res => {
                        if (res.data.success) {
                            this.getList()
                        }
                    })
                })
            },
            freezeUser(userId) {
                this.confirm('你确定要冻结该用户吗', () => {
                    api.freezeUser(userId).then(res => {
                        if (res.data.success) {
                            this.getList()
                        }
                    })
                })
            },
            handleSelectionChange(val) {
                this.selectMessages = val
            },
            exportExcel() {

                const tHeader = ['MessageID', '发送者', '接收者', '内容', '创建日期', '更新日期']
                const data = this.messages.map(message=>{
                    return [
                        message.messageId,
                        message.sender.username,
                        message.receiver.username,
                        message.content,
                        message.createTime,
                        message.updateTime
                    ]
                })
                export_json_to_excel({
                    header: tHeader,
                    data,
                    filename: this.filename,
                    autoWidth: this.autoWidth,
                    bookType: this.bookType
                })
            },
            getList() {
                let params = {
                    page: this.query.page - 1,
                    size: this.query.size,
                    senderId: this.senderId,
                    receiverId: this.receiverId
                }

                api.adminQueryMessage(params).then(res => {
                    if (res.data) {
                        this.messages = res.data.content
                        this.total = res.data.totalElements
                    }
                })
            },
            getDate() {
                if (this.timeRange == null || this.timeRange == undefined || this.timeRange == '') {
                    return {}
                }
                let timeStart = this.timeRange.length > 0 ? this.timeRange[0] : null
                let timeEnd = this.timeRange.length > 1 ? this.timeRange[1] : null
                if (this.timeType == 'createTime') {
                    return {
                        createTimeStart: timeStart,
                        createTimeEnd: timeEnd
                    }
                } else if (this.timeType == 'updateTime') {
                    return {
                        updateTimeStart: timeStart,
                        updateTimeEnd: timeEnd
                    }
                }
            },
            getUserIdOrUsername() {

            }
        },
        created() {
            this.getList()
        },
        filters: {
            crop(content, length) {
                if (content == '' || content == null) {
                    return ''
                } else if (content.length < length) {
                    return content
                } else {
                    return content.substr(0, length) + '...'
                }
            }
        }
    }
</script>

<style scoped>
    .messages {
        margin-left: 40px;
        margin-top: 40px;
        width: 1275px;
    }

    .searchArea {
        margin-left: 40px;
    }

    .searchItem {
        margin-right: 20px;
        margin-bottom: 20px;
    }
</style>
