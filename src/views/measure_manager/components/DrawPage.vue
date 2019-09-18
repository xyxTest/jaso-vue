<template>
    <div>
         <drawer :imageUrl="imageUrl" :points="points" @event="event" />
        <div style="position: absolute; bottom: 0; height: 200px; margin-left:100px">
           <div  :key="index"  v-for="(item, index) in projectCheckList" style="float:left;margin-left:50px;">
              <div><span>{{item.checkName}}</span></div>
              <div hidden >
                 <el-input size="small" >{{item.projectCheckTypeId}}</el-input>
              </div>
              <div style="margin-top:15px">  
                  <span>评判标准：</span>
                  <el-input-number size="small" v-model="pointCheckform.errorLowerLimit"></el-input-number>
                  <span>至</span>
                  <el-input-number size="mini" v-model="pointCheckform.errorUpperLimit"></el-input-number>
              </div>
              <div style="margin-top:15px"><span>设计值：<el-input v-model="pointCheckform.standardNum" placeholder="请输入内容" style="width:250px;"></el-input></span></div>
           </div>
           <el-button type="primary" round @click="save">保存</el-button>
         </div>
    </div>
</template>
<script> 
    import measureManager from '../../../jaso_api/measure_manager.js';
    import Drawer from './Drawer';
    var pageParams = {page: {pageSize: 10, pageNo: 1}}
    export default {
        components:{
            Drawer
        },
        data() {
        return {
            formData:{
              x:'',
              y:'',
              label:'',
              projectId:'',
              measurePaperId:'',
              pointCheckList:[]
            },
            projectCheckList:[],
            pointCheckform:{
              projectCheckTypeId:2,
              errorUpperLimit:5,
              errorLowerLimit:-5,
              standardNum:''
            },
            points:[{}],
            imageUrl:'http://jasobim.com/files/papers/257/05a870402427cc9552a143e1bffa11fc.png',
        }
    },
    methods: {
          event(params){
              this.formData.x=params.point.x;
              this.formData.y=params.point.y;
              this.formData.label=params.point.label;
          },
          save(){
            console.log("this.formData",this.pointCheckform)
            this.formData.pointCheckList.push(this.pointCheckform);
            measureManager.addMeasurePoint(this.formData).then(res =>{
                console.log(res.data)
            });
          }
    },
    mounted() {
      this.projectCheckList=this.$route.query.data;
      this.formData.projectId=this.$route.query.projectId;
      this.formData.measurePaperId=this.$route.query.measurePaperId;
    }
}
</script>