//    var longtime = Date.parseDate("2013-01-01 00:00:00", "Y-m-d h:m:s").getTime();
    
    /**
     * 格式化 秒数 例如125秒 -> 2分5秒
     * @param {} val
     * @return {}
     */
    formatTime = function(val){
        var timestr = "";
        if(val > 86400){ //60*60*24
            var d1 = val/86400;
            var d2 = Ext.util.Format.number(d1, '0');
            if(d1 > 1){
                if(d2 - d1 > 0){
                    d2 = d2 -1;
                }
                val = val - d2 * 86400;
                timestr += d2 + "天";
            }
        }
        if(val > 3600){ //60*60
            var h1 = val/3600
            var h2 = Ext.util.Format.number(h1, '0');
            if(h1 > 0){
                if(h2 - h1 > 0){
                    h2 = h2 -1;
                }
                val = val - h2 * 3600;
                timestr += h2 + "时";
            }
            
        }
        if(val > 60){ //60
            var m1 = val/60;
            var m2 = Ext.util.Format.number(m1, '0');
            if(m1 > 0){
                if(m2 - m1 > 0){
                    m2 = m2 -1;
                }
                val = val - m2 * 60;
                timestr += m2 + "分";
            }
        }
        timestr += val + "秒";
        
        return timestr;
        
//      return new Date(longtime + val*1000).format("H时i分s秒");
    }