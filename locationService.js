angular.module(‘GIS.utils', [])
    .factory("GeoPointTransService", function () {
        var a = 6378245.0
        var ee = 0.00669342162296594323

        this.out_of_china = function (lat, lon) {
            if (lon < 72.004 || lon > 137.8347)
                return true
            if (lat < 0.8293 || lat > 55.8271)
                return true
        }

        this.transformlat = function (x, y) {

            var result = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x))
            result += (20.0 * Math.sin(6.0 * Math.PI * x) + 20.0 * Math.sin(2.0 * Math.PI * x)) * 2.0 / 3.0
            result += (20.0 * Math.sin(Math.PI * y) + 40.0 * Math.sin(Math.PI / 3.0 * y)) * 2.0 / 3.0
            result += (160.0 * Math.sin(Math.PI / 12.0 * y) + 320.0 * Math.sin(Math.PI / 30.0 * y)) * 2.0 / 3.0
            return result
        }

        this.transformlon = function (x, y) {
            var result = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x))
            result += (20.0 * Math.sin(6.0 * Math.PI * x) + 20.0 * Math.sin(2.0 * Math.PI * x)) * 2.0 / 3.0
            result += (20.0 * Math.sin(Math.PI * x) + 40.0 * Math.sin(Math.PI / 3.0 * x)) * 2.0 / 3.0
            result += (150.0 * Math.sin(Math.PI / 12.0 * x) + 300.0 * Math.sin(Math.PI / 30.0 * x)) * 2.0 / 3.0
            return result
        }

        this.wgs2gcj = function (wgslat, wgslon) {
            if (this.out_of_china(wgslat, wgslon)) {
                return [wgslat, wgslon]
            }
            var lat = this.transformlat(wgslon - 105.0, wgslat - 35.0)
            var lon = this.transformlon(wgslon - 105.0, wgslat - 35.0)
            var rad_lat = Math.PI / 180.0 * wgslat
            var magic = Math.sin(rad_lat)
            magic = 1 - ee * magic * magic
            var sqrt_magic = Math.sqrt(magic)
            lat = (180.0 * lat) / (Math.PI * (a * (1 - ee)) / (magic * sqrt_magic))
            lon = (180.0 * lon) / (Math.PI * a * Math.cos(rad_lat) / sqrt_magic)
            var chnlat = wgslat + lat
            var chnlon = wgslon + lon
            return [chnlat, chnlon]
        }
        return this;
    })
