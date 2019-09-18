<template>
    <div>
        <el-table  @selection-change='selectionChange'  :data="table.data" :row-style='currentRowStyle' style="margin:20px 0;" border>
            <el-table-column v-if="basePageTableConfig.selection" type="selection" width="55"> </el-table-column>
            <el-table-column v-if="basePageTableConfig.index" type="index" width="65" :label="basePageTableConfig.indexLabel"> </el-table-column>
            <el-table-column :sortable='existAttri(column.sortable)' :show-overflow-tooltip='basePageTableConfig.showTip' :prop="column.prop" :label="column.label" v-for="(column, index) in table.columns" :key="index" :width="columnWidth(index + 1 === table.columns.length,column.width)"> 
               <template slot-scope="scope">
                    <el-button @click="itemClick(column.prop,scope.row)" v-if="existAttri(column.type) && column.type === 'click'" type="text" >{{existAttri(column.filter) ? (typeof column.filter === 'function' ? column.filter(scope.row[column.prop]) : textFilter(scope.row[column.prop],column.filter)) : scope.row[column.prop]}}</el-button>
                    <el-rate v-else-if="existAttri(column.type) && column.type === 'rate'" :allow-half="true" :disabled="true" v-model="scope.row[column.prop]"> </el-rate>
                    <a v-else-if="existAttri(column.type) && column.type === 'down'" :href="scope.row[column.prop]" download>{{column.label}}</a>
                    <el-switch :disabled="scope.row[column.prop]?true:false" @change="swiChange(column.prop,scope.row)" v-else-if="existAttri(column.type) && column.type === 'switch'" v-model="scope.row[column.prop]" :on-text="column.onAndOff?column.onAndOff.onText?column.onAndOff.onText:'':''" :off-text="column.onAndOff ? column.onAndOff.offText ? column.onAndOff.offText : '' : ''" :on-value="existAttri(column.onAndOff) ? column.onAndOff.on : true" :off-value="existAttri(column.onAndOff) ? column.onAndOff.off : false"> </el-switch>
                    <span v-else :style="existAttri(column.style) ? column.style : (existAttri(column.styleFilter) ? column.styleFilter(scope.row[column.prop]) : '')">{{existAttri(column.filter) ? (typeof column.filter === 'function' ? column.filter(scope.row[column.prop]) : textFilter(scope.row[column.prop],column.filter)) : scope.row[column.prop]}}</span>
                </template>
            </el-table-column>
            <el-table-column v-if="existAttri(table.menu)" :label="existAttri(table.menu.label) ? table.menu.label : '操作'" :width='columnWidth(null,table.menu.width)' >
                <template slot-scope="scope">
                    <el-button :style="existAttri(item.style) ? item.style : null" type="text" v-for="(item, index) in currentMenu(scope.row)" :key="index" @click="menuClick(item.prop,scope)">{{item.label}}</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div v-if="existAttri(table.page)" style="text-align:right;">
            <el-pagination @size-change="pageSizeChange" @current-change="pageNoChange" 
                :current-page="table.page.pageNo"
                :page-sizes="basePageTableConfig.page.pageSizes"
                :page-size="table.page.pageSize"
                :layout="basePageTableConfig.page.layout"
                :total="table.page.total">
            </el-pagination>
        </div>
    </div>
</template>
<script>
    export default {
        mounted(){
            if (this.existAttri(this.table.config)) {
                this.setAttri(this.basePageTableConfig,this.table.config);
            }
        },
        props:{
            table:Object
        },
        //table-data : [{prop,value}...] => [{'prop' : 'value'}
        //columns : [{prop,lable,[style],[width],[click],[filter]}...]
        //menu : {[label],[cols]}
        //rowStyle : [{column,val,[style],[menu]}]
        data() {
            return {
                basePageTableConfig:{
                    index:true, //是否加序号列
                    indexLabel:'序号', //序号列的title
                    selection:false,
                    showTip:true,   //是否显示提示 show-overflow-tip
                    page:{
                        layout:"total, sizes, prev, pager, next, jumper",
                        pageSizes:[10, 20, 50, 100]
                    }
                }
            }
        },
        methods: {
            //set var tag attribute,if var source's any attribute exist in var tag;
            setAttri(tag,source){
                for (var key in source) {
                    if (this.existAttri(tag[key])) {
                        if (typeof tag[key] === 'object')
                            this.setAttri(tag[key],source[key]);
                        else 
                            tag[key] = source[key];
                    }
                }
            },
            //calculates bytes taken by string or array
            getLength(val){
                let temp = '';
                if (typeof val === 'string')
                    temp = val;
                else if (val instanceof Array) {
                    val.forEach(function(element) {
                        temp += element;
                    });
                } else if (typeof val === 'object') {
                    //todo
                } else {
                    temp = val + '';
                }
                var len = 0;  
                for (let i = 0; i < temp.length; i++) {  
                    if (temp.charCodeAt(i) > 127 || temp.charCodeAt(i) === 94) {  
                        len += 2;  
                    } else {  
                        len ++;  
                    }  
                }  
                return len;
            },
            //return the value of the key in filter
            textFilter(text,filter) {
                if (filter.toString().startsWith('yyyy-MM-dd')) {
                    return this.util.formatDate.format(new Date(text),filter)
                } else if (this.existAttri(filter[text]))
                    return filter[text];
                else return text;
            },
            //judge if prop exists
            existAttri(prop){
                return typeof prop !== 'undefined'
            },
            //every column width
            columnWidth(lastFlag,width,opreation){
                if (this.existAttri(opreation)) {
                    if (this.existAttri(width)) {
                        return width;
                    } else {
                        return 'auto';
                    }
                } else {
                    if (lastFlag == null) {
                        let count = 0;
                        var _this = this; 
                        this.table.menu.columns.forEach(function(element) {
                            count += _this.getLength(element.label) + 1;//1 space
                        });
                        if (count <= 4)
                            count += 2; 
                        return count * 11 + "px";
                    } else if (lastFlag)
                        return 'auto';
                    else if (this.existAttri(width)) {
                        return width;
                    } else {
                        //TODO  calc width
                        return 'auto';
                    }
                }
            },
            //current menu options
            currentMenu(row){
                let curMenu = null;
                if (this.existAttri(this.table.rowStyle)) {
                    if (!(this.table.rowStyle instanceof Array)) {
                        console.log('here current menu')
                    }
                    for (let element of  this.table.rowStyle) {
                        if (!this.existAttri(element.menu)) {
                            continue;
                        } else  if (this.existAttri(row[element.column])) {
                            if (element.val.indexOf('null') != -1) {
                                if (!row[element.column]) {
                                    curMenu =  element.menu['null'];
                                }
                            }
                            if (element.val.indexOf('notNull') != -1) {
                                if (!row[element.column]) {
                                    curMenu = element.menu['notNull'];
                                }
                            }
                            if (element.val.indexOf(row[element.column] + '') !== -1) {
                                curMenu = element.menu[row[element.column]];
                            }
                        }
                    }
                }
                return curMenu === null ? this.table.menu.columns : curMenu;
            },
            //current row style
            currentRowStyle(row,index){
                if (this.existAttri(this.table.rowStyle)) {
                    for (let element of this.table.rowStyle) {
                        if (this.existAttri(row[element.column])) {
                            if (element.val.indexOf('null') != -1) {
                                if (row[element.column] == null || row[element.column] === '') {
                                    if (this.existAttri(element.style))
                                        return element.style['null'];
                                }
                            }
                            if (element.val.indexOf('notNull') != -1) {
                                if (row[element.column] !== null && row[element.column] !== '') {
                                    if (this.existAttri(element.style))
                                        return element.style['notNull'];
                                }
                            }
                            if (element.val.indexOf(row[element.column] + '') !== -1) {
                                if (this.existAttri(element.style))
                                    return element.style[row[element.column]];
                            }
                        }
                    };
                }
            },
            //page all method change
            pageChange(){
                var data = {
                    'prop' : '$page',
                    'row' : this.table.page
                };
                this.someClick(data);
            },
            //page size change
            pageSizeChange(val){
                if (this.table.page.pageSize <= 0){
                    return;
                } 
                this.table.page.pageSize = val;
                this.pageChange();
            },
            //page no change
            pageNoChange(val){
                if (this.table.page.pageNo <= 0){
                    return;
                }
                this.table.page.pageNo = val;
                this.pageChange();
            },
            //all click method
            someClick(data){
                console.log("some prop was clicked, data:")
                console.log(data)
                data.row = this.util.clone(data.row);
                this.$emit("click",data)
            },
            //switch change method
            swiChange(prop,row){
                var data = {
                    'prop' : prop,
                    'row' : row
                };
                this.someClick(data);
            },
            //selection was clicked
            selectionChange(selection) {
                var data = {
                    'prop' : '$selection',
                    'row' : selection
                };
                this.someClick(data);
            },
            //table data was cliked 
            itemClick(prop,row) {
                var data = {
                    'prop' : prop,
                    'row' : row
                };
                this.someClick(data);
            },
            //menu option was clicked
            menuClick(val,scope) {
                var data = {
                    'prop':val,
                    'row':scope.row
                };
                this.someClick(data);
            }
        }
    }

</script>

