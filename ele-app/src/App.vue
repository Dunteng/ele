<template>
  <div id="app">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: "app",
  created() {
    this.getLocation();
  },
  methods: {
    getLocation() {
      const self = this;
      AMap.plugin("AMap.Geolocation", function() {
        var geolocation = new AMap.Geolocation({
          // 是否使用高精度定位，默认：true
          enableHighAccuracy: true,
          // 设置定位超时时间，默认：无穷大
          timeout: 10000
        });

        geolocation.getCurrentPosition(); //获取当前定位
        AMap.event.addListener(geolocation, "complete", onComplete); //获取定位成功时执行onComplete()
        AMap.event.addListener(geolocation, "error", onError); //获取定位失败时执行onError()

        function onComplete(data) {
          // data是具体的精准定位信息
          console.log(data);
          self.$store.dispatch("setLocation", data);
          self.$store.dispatch("setAddress", data.formattedAddress);
        }

        function onError(data) {
          // 定位出错
          console.log("尝试精准定位失败，错误信息如下：");
          console.log(data);
          self.getLngLatLocation(); //精准定位失败的情况下进行非精准定位
        }
      });
    },
    getLngLatLocation() {
      const self = this;
      AMap.plugin("AMap.CitySearch", function() {
        var citySearch = new AMap.CitySearch();
        citySearch.getLocalCity(function(status, result) {
          if (status === "complete" && result.info === "OK") {
            // 查询成功，result即为当前所在城市信息
            console.log("通过IP查询到城市信息为：");
            console.log(result);
            AMap.plugin("AMap.Geocoder", function() {
              var geocoder = new AMap.Geocoder({
                // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
                city: result.adcode
              });

              var lnglat = result.rectangle.split(";")[0].split(","); //获取该城市的粗略经纬度

              geocoder.getAddress(lnglat, function(status, data) {
                if (status === "complete" && data.info === "OK") {
                  // data为对应的地理位置详细信息
                  console.log("通过城市经纬度粗略定位到以下信息：");
                  console.log(data);
                  self.$store.dispatch("setLocation", {
                    addressComponent: {
                      city: result.city,
                      province: result.province
                    },
                    formattedAddress: data.regeocode.formattedAddress
                  });

                  self.$store.dispatch(
                    "setAddress",
                    data.regeocode.formattedAddress
                  );
                }
              });
            });
          }
        });
      });
    }
  }
};
</script>

<style>
#app {
  width: 100%;
  height: 100%;
  font-size: 14px;
  background: #f1f1f1;
}
</style>
