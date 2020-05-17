export default {
    methods:{
        success(message){
            this.$message({
                type:'success',
                message:message,
                offset:200,
                duration: 1000
            })
        },
        error(message){
            this.$message({
                type:'error',
                message:message,
                offset:200,
                duration:1000
            })
        },
        confirm(tip,callback){
            this.$confirm(tip, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                callback()
            })
        }
    }
}
