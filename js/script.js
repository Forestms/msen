/*********************************************************************************************
* 初始化变量
*********************************************************************************************/
var myZCloudID = "817214415179";                                   // 智云帐号
var myZCloudKey = "CQcGBAIMAAcFAwUMQxNBU11dUFhBEw0ZDAYFBAYMAAQMARsZGl9WX1QWDhEXXUJKURNKVw";                 // 智云密钥
var DemoMac = "01:12:4B:00:4F:6E:EE:38";                    	// sensor-A采集节点MAC地址
var rtc = new WSNRTConnect(myZCloudID, myZCloudKey);            // 创建数据连接服务对象
var DemoMac1 = "01:12:4B:00:75:69:DB:46";                     // sensor-B
var DemoMac2 = "01:12:4B:00:84:55:23:D7";                    //  sensor-C
var DemoMac3 = "01:12:4B:00:7A:B5:5B:DA";                     //
var DemoMac4 = "01:12:4B:00:E3:DE:11:ED";                      // 压力传感器
var DemoMac5 = "01:12:4B:00:16:34:48:F4";                     //  压力传感器2
 var DemoMac6 = "01:12:4B:00:31:22:46:B5";                    //  家具套装--风扇
 var DemoMac7 = "01:12:4B:00:D2:0B:20:81";                    //  蜂鸣器警报灯
 var DemoMac8 = "01:12:4B:00:6F:37:DF:C6";                    //  食物灯
 var DemoMac9 = "01:12:4B:00:EA:D8:70:90";                      // 水量灯

/*********************************************************************************************
* 与智云服务连接，并监听和解析实时数据并显示
*********************************************************************************************/  
$(function () {
  rtc.setServerAddr("api.zhiyun360.com:28080");                 // 设置服务器地址
  rtc.connect();                                                // 数据推送服务连接
  rtc.onConnect = function () {                                 // 连接成功回调函数
    rtc.sendMessage(DemoMac, "{A0=?,A1=?,A2=?,A3=?,A4=?,A5=?,A6=?}");               // 查询温湿度、灯光初始值
    rtc.sendMessage(DemoMac1, "{D1=?}"); 
    rtc.sendMessage(DemoMac2, "{A0=?,A3=?}");
     rtc.sendMessage(DemoMac3, "{D1=?}");
     rtc.sendMessage(DemoMac4, "{A0=?}");
     rtc.sendMessage(DemoMac5, "{A0=?}");
    $("#ConnectState").text("数据服务连接成功！")
  };
  rtc.onConnectLost = function () {                             // 数据服务掉线回调函数
    $("#ConnectState").text("数据服务掉线！");
  };



  rtc.onmessageArrive = function (mac, dat) {            // 消息处理回调函数
    console.log(mac+" >>> "+dat);
    if (mac == DemoMac) {                                   	// 判断是否是节点的数据

      if (dat[0] == '{' && dat[dat.length - 1] == '}') {        // 判断字符串首尾是否为{}
        dat = dat.substr(1, dat.length - 2);                    // 截取{}内的字符串
        var its = dat.split(',');                               // 以‘,’来分割字符串
        for (var x in its) {                                    // 循环遍历
          var t = its[x].split('=');                            // 以‘=’来分割字符串
          if (t.length != 2) continue;                          // 满足条件时结束当前循环
          if (t[0] == "A0") {        
                                     // 判断参数A0
            var tem = parseFloat(t[1]);                         // 读取温度数据
            $("#currentTem").text(tem + "℃");                  // 在页面显示温度数据
            if (tem > 30 ) {
              $('#btn_img2').attr('src','images/Fan-on.gif');    // 根据温度决定风扇是否开启
              rtc.sendMessage(DemoMac6, "{OD1=16,D1=?}"); 
            } else {
              $('#btn_img2').attr('src','images/Fan-off.png');
              rtc.sendMessage(DemoMac6, "{CD1=16,D1=?}");
             }

          }
          if (t[0] == "A1") {                                   // 判断参数A1
            var hum = parseFloat(t[1]);                         // 读取湿度数据
            $("#currentHum").text(hum + "%");                   // 在页面显示湿度数据
          }
          if (t[0] == "A2") {                                   // 判断参数A1
            var hum = parseFloat(t[1]);                         // 读取湿度数据
            $("#currentGQ").text(hum + "LUX");                   // 在页面显示湿度数据
          
          if (hum < 10) {
              $('#btn_img').attr('src','images/light-open.gif');  //根据光强决定是否开灯
              rtc.sendMessage(DemoMac1, "{OD1=16,D1=?}"); 
            } else {
              $('#btn_img').attr('src','images/light-close.png')
              rtc.sendMessage(DemoMac1, "{CD1=16,D1=?}"); 
             }
        }



          if (t[0] == "A3") {                                   // 判断参数A1
            var hum = parseFloat(t[1]);                         // 读取湿度数据
            $("#currentKQ").text(hum + "PM");                   // 在页面显示湿度数据
          }
          if (t[0] == "A4") {                                   // 判断参数A1
            var hum = parseFloat(t[1]);                         // 读取湿度数据
            $("#currentAP").text(hum + "PA");                   // 在页面显示湿度数据
          }
          if (t[0] == "A5") {                                   // 判断参数A1
            var hum = parseFloat(t[1]); 
            if(hum==0){
             $("#currentDD").text("未跌倒！"); 
            }                      
            else{
             $("#currentDD").text("已跌倒！"); 
            }                  
          }
          if (t[0] == "A6") {                                   
            var hum = parseFloat(t[1]);                         
            $("#currentJL").text(hum + "CM");                   
          }


		  
        }
      }
    }  
          
  if (mac == DemoMac2) {                                     // 判断是否是节点的数据

      if (dat[0] == '{' && dat[dat.length - 1] == '}') {        // 判断字符串首尾是否为{}
        dat = dat.substr(1, dat.length - 2);                    // 截取{}内的字符串
        var its = dat.split(',');                               // 以‘,’来分割字符串
        for (var x in its) {                                    // 循环遍历
          var t = its[x].split('=');                            // 以‘=’来分割字符串
          if (t.length != 2) continue;


          if (t[0] == "A0") {                                   // 判断参数A0 人接近与否
            var LightStatus = parseInt(t[1]);                   // 根据D1的值来进行开关的切换
            if ((LightStatus & 1) == 1) {
              $('#btn_img0').attr('src','images/Alarm.gif')
              rtc.sendMessage(DemoMac7, "{OD1=3,D1=?}");
              
            } else if ((LightStatus & 1) == 0) {
              $('#btn_img0').attr('src','images/Alarm.png')
              rtc.sendMessage(DemoMac7, "{CD1=3,D1=?}");
            }
            }

          if (t[0] == "A3") {                                   // 判断参数A3  火焰 警报
            var LightStatus = parseInt(t[1]);                   // 根据D1的值来进行开关的切换
            if ((LightStatus & 1) == 1) {
              $('#btn_img1').attr('src','images/Alarm.gif')
              rtc.sendMessage(DemoMac7, "{OD1=3,D1=?}");
              
            } else if ((LightStatus & 1) == 0) {
              $('#btn_img1').attr('src','images/Alarm.png')
              rtc.sendMessage(DemoMac7, "{CD1=3,D1=?}");
            }
            }
             }
              }      
            }
           
       if (mac == DemoMac4) {                                     // 判断是否是节点的数据   shui
 
      if (dat[0] == '{' && dat[dat.length - 1] == '}') {        // 判断字符串首尾是否为{}
        dat = dat.substr(1, dat.length - 2);                    // 截取{}内的字符串
        var its = dat.split(',');                               // 以‘,’来分割字符串
        for (var x in its) {                                    // 循环遍历
          var t = its[x].split('=');                            // 以‘=’来分割字符串
          if (t.length != 2) continue;
          if (t[0] == "A0") {                                   // 判断参数D1
            var t = parseFloat(t[1]);                   // 根据压力传感器的值来进行灯颜色的切换
            if (t > 0) {
              $('#btn_img4').attr('src','images/rgb-g.png')
              rtc.sendMessage(DemoMac9, "{CD1=1,D1=?}");
              
            } else {
              $('#btn_img4').attr('src','images/rgb-r.png')
              rtc.sendMessage(DemoMac9, "{OD1=1,D1=?}");
            }
          }

    }      
  }
 
  }
  if (mac == DemoMac5) {                                     // 判断是否是节点的数据   shui
 
      if (dat[0] == '{' && dat[dat.length - 1] == '}') {        // 判断字符串首尾是否为{}
        dat = dat.substr(1, dat.length - 2);                    // 截取{}内的字符串
        var its = dat.split(',');                               // 以‘,’来分割字符串
        for (var x in its) {                                    // 循环遍历
          var t = its[x].split('=');                            // 以‘=’来分割字符串
          if (t.length != 2) continue;
          if (t[0] == "A0") {                                   // 判断参数D1
            var t = parseFloat(t[1]);                   // 根据压力传感器的值来进行灯颜色的切换
            if (t > 0) {
              $('#btn_img3').attr('src','images/rgb-g.png')
               rtc.sendMessage(DemoMac8, "{CD1=1,D1=?}");
              
            } else {
              $('#btn_img3').attr('src','images/rgb-r.png')
               rtc.sendMessage(DemoMac8, "{OD1=1,D1=?}");
            }
          }

    }      
  }
 
  }

};
}
) 