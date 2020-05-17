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

            <el-select v-model="userIdOrUsername" placeholder="请选择时间类型" class="searchItem">
                <el-option :label="'用户Id'" :value="'userId'"></el-option>
                <el-option :label="'用户名'" :value="'username'"></el-option>
            </el-select>

            <el-input class="searchItem" style="width: 200px" clearable v-model="userIdOrUsernameValue"/>

            <el-button @click="getList">查询</el-button>
            <el-button type="danger" v-show="showBatchDelete" @click="batchDelete">
                批量删除
            </el-button>
        </div>
        <el-table
                :data="users"
                border
                @selection-change="handleSelectionChange"
                class="users">
            <el-table-column
                    type="selection"
                    width="55">
            </el-table-column>
            <el-table-column
                    prop="userId"
                    label="userId"
                    align="center"
                    width="80">
            </el-table-column>
            <el-table-column

                    align="center"
                    prop="username"
                    label="用户名"
                    width="150">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="description"
                    width="350"
                    label="描述">
                <template slot-scope="{row}">
                    <span :title="row.description">{{row.description|crop(10)}}</span>
                </template>
            </el-table-column>

            <el-table-column
                    prop="createTime"
                    label="创建时间"
                    align="center"
                    width="170">

                <template slot-scope="{row}">
                    <span>{{row.createTime|formatDate}}</span>
                </template>
            </el-table-column>


            <el-table-column
                    prop="updateTime"
                    label="更新时间"
                    align="center"
                    width="170">

                <template slot-scope="{row}">
                    <span>{{row.updateTime|formatDate}}</span>
                </template>
            </el-table-column>

            <el-table-column
                    label="状态"
                    align="center"
                    width="100">
                <template slot-scope="{row}">
                    <el-tag :type="row.statusDescription=='正常'?'success':'warning'">{{row.statusDescription}}</el-tag>
                </template>
            </el-table-column>

            <el-table-column
                    label="操作"
                    align="center"
                    width="200">

                <template slot-scope="{row}">
                    <el-button slot="reference" type="danger" @click="singleDelete(row.userId)">删除</el-button>
                    <el-button type="warning" @click="freezeUser(row.userId)">冻结</el-button>
                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="query.page" :limit.sync="query.size" @pagination="getList"/>
    </div>
</template>

<script>
    import * as api from '@/common/request'
    import message from "@/common/message";
    import pagination from "@/components/pagination";


    export default {
        name: "users",
        mixins:[message],
        components: { pagination },
        data() {
            return {
                users: [],
                selectUsers: [],
                query: {
                    page: 1,
                    size: 6
                },
                total:0,
                timeType: 'createTime',
                timeRange: [],
                userIdOrUsername: 'userId',
                userIdOrUsernameValue: ''
            }
        },
        computed: {
            showBatchDelete() {
                return this.selectUsers.length > 0
            }
        },
        methods: {
            batchDelete(userId) {
                this.confirm('你确定要删除选中的用户吗',()=>{
                    let userIds = this.selectUsers.map(user=>user.userId).join(",");

                    api.deleteUsers(userIds).then(res=>{
                        if (res.data.success){
                            this.getList()
                        }
                    })
                })
            },
            singleDelete(userId) {
                this.confirm('你确定要删除该用户吗',()=>{
                    api.deleteUser(userId).then(res=>{
                        if (res.data.success){
                            this.getList()
                        }
                    })
                })
            },
            freezeUser(userId) {
                this.confirm('你确定要冻结该用户吗',()=>{
                    api.freezeUser(userId).then(res=>{
                        if (res.data.success){
                            this.getList()
                        }
                    })
                })
            },
            handleSelectionChange(val) {
                this.selectUsers = val
            },
            getList() {
                console.log(this.getDate());

                let params = {
                    page: this.query.page -1,
                    size: this.query.size,
                    ...this.getDate(),
                    ...this.getUserIdOrUsername(),
                }

                api.getUsers(params).then(res => {
                    if (res.data) {
                        this.users = res.data.content
                        this.total = res.data.totalElements
                    }
                })
            },
            getDate() {
                if (this.timeRange==null||this.timeRange==undefined||this.timeRange==''){
                    return  {}
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
                if (this.userIdOrUsername == 'userId') {
                    return {
                        userId: this.userIdOrUsernameValue
                    }
                } else if (this.userIdOrUsername == 'username') {
                    return {
                        username: this.userIdOrUsernameValue
                    }
                }
            }
        },
        created() {
            this.getList()
        },
        filters: {
            crop(content, length) {
                if (content == '' || content == null) {
                    return ''
                } else {
                    return content.substr(0, length) + '...'
                }
            }
        }
    }
</script>

<style scoped>
    .users {
        margin-left: 40px;
        margin-top: 40px;
        width: 1275px;
    }

    .searchArea {
        margin-left: 40px;
    }

    .searchItem {
        margin-right: 20px;
    }
</style>
