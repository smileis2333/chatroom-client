export default {
    methods:{
        success(message){
            this.$message({
                type:'success',
                message:message,
                offset:200
            })
        },
        error(message){
            this.$message({
                type:'error',
                message:message,
                offset:200
            })
        },
    }
}
