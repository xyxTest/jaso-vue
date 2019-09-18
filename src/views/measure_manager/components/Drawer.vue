<template>
  <div id="canvas_main">   
    <!-- <div class="log">
        当前点位: {{tempCurrent.data.subscript || '无'}} 
       
    </div>  -->
  </div>
</template>

<script> 
const range = 23, pointImage = new Image()

function S4() {
    return (((1+Math.random()) * 0x10000) | 0).toString(16).substring(1);
}
function guid() {
    return S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4();
}
function isPlainObject(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]'
}

export default { 

  props: {
    points: {
      type: Array,
      required: true
    },
    imageUrl: {
      type: String,
      required: true
    }
  },

  data () {
    return {
      height: 800,
      width: 800
    }
  },

  methods: {
    init() {

      //放大比例
      this.scale = 1 
      this.imagePoint = {}
      this.main = document.getElementById('canvas_main')  
      pointImage.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAZZklEQVR4Xu1da5QcVbX+dvVMXoSQBCQICIgJecx0RzSYZLo6OElXDYbH8nEVFqAiirhg+cIHKg9REBFYYlwXlYfi9V58RC8qYmC6exhJVw8hCYRU9QQSAkThZqGSBJBkksx07buqZ8AQ8uhHVZ9T1af/ZeXsvb/97fNNVZ2qsw9B/RQDioH9MkCKG8WAYmD/DCiBqNmhGDgAA0oganooBpRA1BxQDNTGgLqC1MabsmoSBpRAmqTQKs3aGFACqY03ZdUkDCiBNEmhVZq1MaAEUhtvyqpJGFACaZJCqzRrY0AJpDbelFWTMKAEEnCh23p7x8dKrSczYzYxZjNhKoDxAI8jxlgmjCXQWACHjUAZYMYAwDsIGGDCAHn/JrwEpseYuFiK0dp1C/X+gKEr9wCUQHycBtMt69CWAa0jBp7H4JM9QYBwgo8h3uCKmR8FYS1BW12KuX39C1Nrg4rVrH6VQOqofDyXP5FdJDWiDgZ3gKmdCFodLusyZcYrAFYQUR+TW3BjQyv6OztfrctpkxsrgVQ5Ad7Zu2ZiaWj7JwC+iEAzqzRv9PBBAPe6TLcXjY4siLjRAMIeTwmkwgq25azOmMsXMfBBIhpdoZk8w5ifBeGncLU77K7kP+QBJjcSJZAD1Md7wKbBlos14FIQvV3uUlaF7h64dKvdlXywKqsmHKwEso+it/WuPIqGdl+mAZ/eY3UpctPDe8hnohuL6eTvQORGLkEfElIC2YPExIPWdB7C1wCcS4RRPvAbChcMfgaM728bH/vZ8x0dA6EA3SCQSiAApmeso0eBlxDRfzSId0nD8IvMuMYxU7dKCrDhsJpbIEs5lphU+CKYrwHRIQ1nX9qA/JiLlvOLxvwnpIXYIGBNK5C2XOEUjd2fE2hWg7gOVxjmEgNLtkwee9XmOXN2hAu8f2ibTiBTl62YMLZ18BYCXegfjdH1xMzPA3SxY+rLopvl/jNrKoEkugvtIPfeiC3ZNmbeMi2xW3d/GZ2dQ40JKEeUphFIPGNdDOIfEGiMHNSHEAXzyl2gD6w39c0hRF8T5MgL5OjVq8cdvm3nHQScWxNDyugNDDBjK2l8np1OPdAM1ERaICPvNf5AhBnNUMyG5sj4rm3q32hoTAHBIiuQtsxy7yvbBwg0XgCvTRGSgT8ODE45e+PiabuimnAkBdKes87WGP8NoDWqhZMlLwZWYwybTiq1TRZMfuKInEAS2cI3Ab7GT5KUrwMzwMDTIDaddOqZqHEVHYEwa4msdTeIzolakcKQT/nhnXC6begrwoC3UoyREUg8k19KRB+uNHE1LhAGBoagJdcZHWsC8S7AaSQEkshaNwH4sgD+VMg3McAvlkDv7jf0v0WBnNALJJHLXwIm9fWpRLORGRsHtdZ5T6bnbpEIVk1QQi2QRHf+TNboj6S6s9RU/GCN+LFXWoaSmzo7dwYbJ1jvoRVI+Wtcl61m2tgU7FTw3zszljlG8owwN4sIpUAS3YUjWeN1BBzuf1mVRz8ZcMHfKRqpK/302Uhf4RPIUo7FJxXyBMxvJFEqVm0MMMAMXlg0Un+pzYNYq9AJJJ7L30BMl4ulTUWvhgEGtpBLs8LYbihUAmnPWYbGyFRTHDVWEgaYC7ahp8L2PBIagXiNFUYT9wM0UZKSKxhVMhDG55HQCCSRtZYDSFVZEzVcMgZKQKrf0C3JYO0XTigEEs/mzyXQ3WEhVeHcPwMMrHdaBtvDsnVXeoGc0Ns75tChlmcJdJSaeFFhgK+0jdR3wpCN9AJJZPI3g+hLYSBTYayMAWbeRTxqpt0199nKLMSNklog3pZZlPCkOHr8jVw+v4N4FQEbANrAGtZzCf/UuHXLq1ps6zPGnJfLL0FBk7kFk7VS6XiQdhKDpxF4JkDv8heROG/MyDqmbopDUFlkqQUSz1q9BLy3slTkHMWM+6HxH6ik9dldyWI9KL0GFEds3T2f4S4g4GNBnl5VD85KbV3COcW0/ptKx4sYJ61A4j3W+8hFKJuVMfgFMN1OrS132J3zng+qsPFcPg3GpQR6f1AxgvXLG2wjNT3YGPV5l1cgGetxIsyuL72GW292QTfsHDzy9kY2Mih3bynhajDOEXkEXC1sy34VkVIg7bn8GRrTn2ohXJDNADN/yzFT3xMUvxw23t03g8i9FYSFInFUFZtRtE09XpVNAwdLKZB4iK4eXuub3YxLZOo26L03Auj7BExp4FyqOZRLfGYxnbqvZgcBGkonkETGOguEPwaYs0+uvbM06OOyNnUuHzY6uP0HRPi4TwkH5sZrHeQY+imBBajDsXwCyeYflX05k5l/i7G4OAy9oOIZazEBd4FwZB3zJHDTEmFhf1rvDTxQlQGkEki8O/9u0mh1lTk0dDiDrnOM5FUNDVpnsJk9heNbS/wXmZeFGbjbMfTz60zVd3O5BJK1vPvmL/qepQ8OvY0/YP5sWI8nm7p8+VvG7tJ6CJD1gXjglZbBybLtYZdKIImM9XdpbwWIL7XTqR/5oDVhLkaeS1YRYaowEAcKzHyubaZ+JRM2aQTivfQipqxM5LyGhZlvdMxUJHYxtmWt42Jg7znvCNm4ZuDPjqGfIRMueQSSse4iwgUykeNhYebfOWYqUh0bZ2X7Tm6B+5hsXHt4SiXt8P7TOrbKgk0KgUxd9tTosa0vvCjdUQWMTVvHa7OieHZ4ey7/OY1piSwT8d846BLbSP5YFlxSCMRrAAeN7pWFlNdwuIxTiqYu9apaPZzFM9afibC4Hh9+2zK4xzFSab/91upPDoFk8ktA9LlakwjCjglXO2n92iB8y+LTW9kat0t7CsBhsmACINVqlhQCiWfz/VKdV878lP2SPhMfoZJEEycQKO0565Ma485AnNfq1KVFdlfywVrN/bQTLpCRv2L/8DOpen0NadrcdYs6VtbrJyz28azVJ1MjPpm6nwgXSHumcL5G7B2XJsUviqtWByNWti8YGFjhGLoUnTOFCyQu2fJuidy2/vSCdQebVFH7/3g2nyWQFA/HzHCJD51gd83eLppn4QJJZK1NAI4XTUQ5PuNPtqmfJQWWBoOIZ/pOJXKl6Z/LjNNl+FJaqEAS3WsPgfavVxs8F/YbzmXqKprJpm1tmshYRRDapKgH4wrb1K8XjUWsQLLWPAAPiyZh+OrB/7QNfUrYesf6yV0iY30DBFn6Vf3CNnThe1mECiSeKVxAxHf5WeRafTFwi2Pol9VqHwW7RO+KYzE09JwUuTA/Ypsp7w+o0J9QgSQy1vUgfF0oA/8OPj9qRxjXwmsik38ERO+pxdZfG37JNlKT/PVZvTehAoln87+XomUN83bbTI2vnr7oWcSz1ncJ+JoUmbk0RfSZImIFkrGeIMIM0cXwGi84hh7S3lL+sifVGSyEBXZaz/ubYXXehAokkbW4OrgBjWb+gm2mJPyyNaB8D+D22L6+sZO3uzsaH/nNERl0oWMkhT6jChOI17V9wlDrgAyFaPbl3b1rEM/mnybQiaJrw0yXO2byRpE4hAkkns9Pop0kxcaYQY1OeGJR8q8iCyFT7EQ2fz9Ap4nGxMANjqELXcQRJpDhI9Xwf8KLwLzLMVNjROOQKX5Cku0HzLjNMfXPiORGmEDaewrv0FzeKDJ5LzYzP+eYqeNE45ApfiJrfRnATaIxMbDUMfSzReIQJpBEd6EdGjsiky8LBHjaMXQ5u3wIIieRzX8MoP8SFP71sDKcISJMIG25wikxZuF7Lhj8hGOkZomeDDLFT+Typ4HpftGYZGhJKk4gmeXJGGniTztl9Num3i56MsgUf1ZP33taXPcR4Zi8nZ1m6iSROIQJRJpNOoxNtqm/XWQRZIsd7yksIJcfEo5Lgj9ewgTSnn14poaS8I1JDGxxDF26JmoiJ6c057Mwr7TN1FyRXAgTyIzeh08YNVQSfsqpd+KqWuZ94xSU5Vx6Bv7iGHpnUwrE6xPrDm3fJjL512JrLYdMerzz5JdkwCIDhvZM/ksa0c0SYLnHNvQPicQh7AriJZ3IWNtBGCeSgHJsl+fZXSnxD6XCiRgGkMhYd4DwKeFwmJbYZvILInEIFYgs/bBc5o8VzZQ0nVVEToiyQLLWcgAp0TgYuMwx9FtE4hAqEFm++QHjetvUrxBZCJlixzP5rUQkfLOSC3yoaOj3iORGrEAyhR+A+PMiCfBiM3OfY6aSonHIEF+WLxzKd76IzSoa858QyYtYgeSsj4Pxc5EEDMfmIbgTJsrQh0k0F4ms5d3zC72tGeFgwE4nDxHdREOoQOLZvjjBtUVPiuGriBx9mERzEc9a9xFwumgcYC7YZkoXjUOoQEYeCKXYVcjguxwjdaHogoiML9PSO5h/aJsp4bffwgUSz+QLRNQhcmKUryDAv5yWwcno7BwSjUVU/Hgu/2liuk1U/D3jMvg8x0j9UjQW4QJpz1o3asBXRBMx8rD+EcdM/VYGLCIwyLK86+Uuyy5P4QKJ5/reT+z+XsSE2DsmMz/kmKn3yoCl0RjacstnxVjrb3Tc/cTbbBv6MTJgES6QGblHDh/Fgy/KQIaHwdW0ZHFRR58seBqFI57JLyUiWQ4r/Y1t6Oc0KvcDxREuEA9cPGvZshxwz4xljqmLX8Vp4OyY1ds3NTbkbiBAivngEj5VTOs/bSAF+w0lBSHt2fx1GkiaN9nM2nsds0P8fogGzZB4xsoQwWhQuAOGYYDdknaELEdBSyEQaXawvVY65mdLx0ye0d/WtluGSRMkhvacdbbG+HWQMarxLdtXDVIIpHyblclvJqK3VkNmkGOZca1j6lcHGUO07+HeZNgAkDQbxmRoFrdnXaQRSHs2f6sGukT0pPn3RQRuKabNj/JhnvFM/h4i+oAsnJdxtLS8ze6c97wsmKQRiGxHgHkF8npmua1Ds/o7O6U5BcuviSPTS8HX/ygBqx1DP8WvHP3wI41ARlazXiBgih+J+eUjiqfetj2Ynx0r0eN+ceSjn6/Yhi7DTsbXU5JKILK0vNy74C5wU9HQv+rjRBDmqr37obeRFlsl2x8iGW+vPExyCaQ7PxcarRA2ew4QmIHPOob+nzJiqxST9zFiaWj7CgKmV2rTqHHMWO6Y+qmNildpHKkEMnybJUfr/b0J9NbnCXyVbaRkOeSy0hqXx7VlreM0ICOjOMoAGRfZpn5nVUk1YLB8AslZVxHj2w3IvaYQzPzbgaGjPrpx8bRdNTkQYNSWszpjzPcANFFA+IOGZPDOLZPGHr55zhwpDu7ZE7B0Apnd03eM67rPyfLZw76qy4BTatE+uK6zQ3h3+gPOPmaK56wriHENiGIHnamCBjDwS8fQzxMU/oBhpROIhzaRtR4EILRh2MGK5e0fIdAnbCP5vwcbK+L/T+pdfcTooYFfESgtIn41MV2CWUzr2WpsGjVWSoHEM/kPE9HSRpFQTxzvDAu3ZdTn+zvf80I9fvy0TXh7/V2+CURv8dNvEL4Y/IxjpN4RhG8/fEopkJGriHf61NF+JBm0D2a8AsIVole5RjqS/BiA8L3cFXNOfKmdTv2o4vENHiitQOKZ/OVEdEOD+agvHGMTE10/atLonz86Z85gfc4qt/Y2O2kufQtEH5L52W3vjLzb1G2HaFOe7+iQ4jDXfTEur0AkOuSz8qk6PJKBvwH48a6WMXdu6JwT2GYwrws7MV1EwFnVYpRhfBhewEorkJHbLO92QeghjvVOJG9ZGNCWaZrbtzad2lCPv6nLVkwYN2qwAy4tYMKFUr4NryJB1y0dV+w69bkqTBo+VGqBzM7lT2Km9Q1nJaCAzNhKxCsZ9BSADcy0QYtpL+7WsHX3UOu2Z4w5L7fnVkwB82SNSke4Lp9AoGlEOImBWbLsuvSDHgbudgz9fD98BelDaoGUryIZ614QzgySBOW78QwwtIRjdAg/xPVgmUsvEBk/gz8Yqer/D8pAr23oCw86SoIB0gtk+Fkk/yhA75KALwXBDwaI32enUw/44SpoH6EQiEy9s4IuSBP4X2Mbemj+2IVCICPPIkUQ2ppgAkU6RSbtA0664w9hSTI0ApGt+0ZYCiwTTgavc4xUqP7IhUYgYKZE1loPomkyFV1hqZwBZg5d7+PwCASAuopUPhllGxnGq4fHYagEola0ZJv2leNhjU51FiW9w0FD9QudQOK5wnxibrrm0qGaVXuBZcb9jqkvDmMOoRPIyIqWersektnm7eVnjaYVFyWfDgnkN8AMpUCi9o1WGCdOxZgZd9qmflHF4yUbGEqBeBzGs/nbCRRa4iWbB4HAYeZdu1rHHhvkJ/+BAN/DaWgFkuguHMma+1cCjQmaJOW/NgYYdJ1jJK+qzVoOq9AKZPgqUriWwFfKQaVCsScDzLxt2/jYMTLvFqykYqEWyHTLOnT0AD8jU/v+SkhvjjF0iW0kvQ1vof6FWiDlq0jGupgIPwl1FSIGvvxSMK3HQeSGPbXQC2Tkgb2fQLPCXozI4CcssNN6Pgr5REMgPYUF5HLTnCko98Tj+2wjFZkdoJEQiDdh1NZcKWQz6Go0M6wvBffFYGQEEs/lTySmUL6tlWJq+wCCmW90zNTlPriSxkVkBFK+imTzVwB0nTTsNhMQxqZXWgdnburs3BmltCMlECzlWHxSoV/aMzCiNHP2ziVCD+Z7phYtgQx3hp8H4OEoz0XZcgtLj6taeIucQIZvtazQd2SspZgibLw35gNjePrGBQv+KSJ+0DGjKZDutYew9q+nw96aM+ji++HfZfpo0Uz+jx++ZPQRSYF4RLdnC6dr4PtkJD0qmBjc4xgp6Q/oqYfvyApk5Fbr1wDOrocgZbtvBhj86m6m6etNfXOUOYq0QMrHkA3uXE+EyVEuoojcmPEZx9RvExG7kTEjLZDyrVYuf4bG9KdGkhr1WAzOOUbKiHqeXn6RF4iXZDyb/5l34GYzFDT4HPnF3TRqxpPpuVuCjyU+QlMI5OjVq8cdvnXgSSJ6m3jKQ46AtbRtdvSEPIuK4TeFQMpXEdUuqOJJsb+BzLjNMfVQn/hVLQlNI5DhVa3CNwG+plqS1HiPAd6wY/CoxMbF03Y1Ex9NJRCvv288V+gjwPscRf0qZIAZu0steNe6hXp/hSaRGdZcAvGuIr0rjuXBoX4iTIhMFQNOhIHLHEO/JeAwUrpvOoF4VWjLFc6JMf9KyopIB4ofsI3U+6SD1SBATSmQ4eeR/C8A+miDeA5pmOZa0t1XkZpWIN7S7xFbB4ogentIZ2/wsF1aZHclHww+kLwRmlYg5VutTOGdMXJXAdQib4mEIbvZNvSvCIsuSeCmFohXg3im8FUi/p4k9ZAFRqgO2gyStKYXyLBIrG4imEESHSLfL7tuKV7sOvW5EGEODKoSCIATs6sPG4+dawEcHxjTIXDsneVBrBnN9CnJwcqiBDLCUDzbFweXVhHR6IORFtX/Z8a3HVP/ZlTzqyUvJZA9WItnChcQ8V21EBl2G2ZkHVNXt5l7FVIJZC9CEpn8EhB9LuwTvkr8m3cMtszcuHjeK1XaRX64EsjeJWbW4jkrQ6BFka/+cIKDQ9DmrjM61jRJvlWlqQSyD7qmLlsxYWzr4BoCnVgVmyEc3CxbZ2stjRLIfpjzDgp1XVoV5Y8aGXyHY6Q+XevkaQY7JZADVDnRXVjIxFkiaNGbDPyAndZPj8IhN0HWRgnkIOy2Z/Jf0ohuDrIIAnyv2TE4ZX6zbX6qhWclkApYi9KXv8zYOKi1zmuWpgsVlPeAQ5RAKmGwt7clPtjaQ4QFlQyXdQwDW9gtnaw+I6m8QkogFXLlnag7agdWEmFGhSZSDWPwTpe1+f1m8nGpgEkORgmkigLN7uk7hl13JYCjqzCTYqhLfGYxnVK9iqushhJIlYTNzKyY1kqDKwGaWKWpkOHeB4gu0bn96aTXp1j9qmRACaRKwrzh7RlrjgY8BMK4GswbaqJeBNZHtxJIjfwlMn2LQG6uRvOGmDHhaietX9uQYBENogRSR2Hbsn1dGrv3EmFUHW4CMWXgBsfQvx6I8yZyqgRSZ7FlFIkSR51F3cNcCcQHLhPd+TOh0b0+uKrbBTOudUz96rodKQdlBpRAfJoI3ndb0MpHvo31yWX1bpi/YJupJdUbKov9MaAE4uPcSHTn5zJRptFfAHtLuQB90jGSTbkb0scSvsmVEojP7Lblls/SmHoIdJTPrvfpjpl3EegjtqlLcYvXiJwbGUMJJAC2vTfuruv2EDA9APd7unwZwGm2oa8IOE7TulcCCaj07+xdM9Ed2n4PgM6AQvyVXe00p6vjyYD8K7fqIT3gObCUY/GJhSVEuNTPSMz8UKx1/Psf7zz5JT/9Kl9vZkBdQRowK+I56zxi3ArgsPrD8bdsI6VOyaqfyIo8KIFURFP9g2Y+sPytLTHtJwScVYs3BlaRSxfaXcliLfbKpjYGlEBq461mq/L7EnJ/AqJplThh4O8M/kYxrd8FIq7ERo3xjwElEP+4rNxTb29LYrD1AhCu3F8/YG/3H4Cbt0wa88PNc+bsqNy5GuknA0ogfrJZg6+2zPKkBs3EcHd57zCfXxJrf1YNpGsgMwATJZAASFUuo8OAEkh0aqkyCYABJZAASFUuo8OAEkh0aqkyCYABJZAASFUuo8OAEkh0aqkyCYABJZAASFUuo8OAEkh0aqkyCYABJZAASFUuo8OAEkh0aqkyCYABJZAASFUuo8OAEkh0aqkyCYABJZAASFUuo8PA/wO/jyNBvosFswAAAABJRU5ErkJggg=='

      

      //init background image
      let img = new Image()
        img.src = this.imageUrl
        img.onload = e => {
          var newHeight = window.innerWidth / img.width * img.height 
          this.width = img.width
          this.height = img.height 

          let canvas = this.createLayer()
          this.imageParams = {
            canvas: canvas,
            image: img
          }

          //init points
          this.pointParams = this.points.map(point => {
            let canvas = this.createLayer()
          
            return {
              canvas: canvas,
              ... point
            }
          })
          this.drawBackground(this.imageParams)
          this.drawPoints(this.pointParams)
        } 
      
    },
 
    drawBackground(params) {
      let context = params.canvas.getContext('2d')
      context.setTransform(this.scale, 0, 0, this.scale, 0, 0)
      context.drawImage(params.image, 0, 0, this.width,  this.height)
    },
    drawPoints(params) {
      params.map(el => {
        let context = el.canvas.getContext('2d')
        context.font="18px Georgia"
        context.setTransform(this.scale, 0, 0, this.scale, 0, 0)
        context.drawImage(pointImage, el.x - range, el.y  - range, 45, 45)
        context.fillText(el.label || '', el.x + 16, el.y + 5);
      })
    },

    createLayer() {
      let canvas = document.createElement("canvas") 
      canvas.id = 'm' + guid() 
      canvas.style.position = 'absolute'
      canvas.style.left = 0
      canvas.style.top = 0
 
      canvas.width = this.width
      canvas.height = this.height

      this.main.appendChild(canvas)
      return canvas
    },

    // draw(canvas, x, y, data) {   
    //   let context = canvas.getContext('2d')
    //   context.setTransform(this.ratio, 0, 0, this.ratio, 0, 0)

    //   context.fillStyle="#FF0000";
    //   context.beginPath(); 
    //   //x,y,r
    //   context.arc(x, y, 16, 0, Math.PI * 2, true);
    //   context.closePath();
    //   context.fill(); 
    //   if (data) {
    //     context.font="16px Arial";
    //     context.fillStyle="black";
    //     context.fillText(data.subscript, x - 10, y + 7);
    //   }
    //   this.imagePoint[canvas.id] = {
    //     leftX: x - 50, 
    //     leftY: y - 50, 
    //     rightX: x + 50, 
    //     rightY: y + 50, 
    //     canvas: canvas,
    //     data: data 
    //   }
    // },

    findLayer(x, y) { 
      for (let point of this.pointParams) { 
        if (point.x - range <= x && point.y - range <= y && point.x + range >= x && point.y + range >= y)
          return point
      } 
      return null
    },

    delPoint(canvas) {
      let context = canvas.getContext('2d')
      context.clearRect(0, 0, this.width, this.height);  
    },

    redraw(params) {  
      this.delPoint(params.canvas)
      this.drawPoints([params])
    },

    // draw$p1(page) { 
    //   if (this.canResize != void 0 && !this.canResize)
    //     return

    //   this.canResize = false
    //   let canvas, ctx, ratio
    //   if (this.page) {
    //     canvas = this._canvas
    //     ctx = this._ctx
    //     ratio = this._ratio
    //   } else {
    //     this._canvas = canvas = this.createLayer()
    //     this._ctx = ctx = canvas.getContext('2d')
        
    //     let dpr = window.devicePixelRatio || 1
    //     let bsr = ctx.webkitBackingStorePixelRatio 
    //       || ctx.mozBackingStorePixelRatio 
    //       || ctx.msBackingStorePixelRatio 
    //       || ctx.oBackingStorePixelRatio 
    //       || ctx.backingStorePixelRatio 
    //       || 1
          
    //     this._ratio = ratio = dpr / bsr
    //   } 

    //   let viewport = page.getViewport(screen.availWidth / page.getViewport(this.scale).width)
    //   canvas.width = viewport.width * ratio 
    //   canvas.height = viewport.height * ratio 
    //   canvas.style.width = viewport.width  + 'px'
    //   canvas.style.height = viewport.height  + 'px'
    //   ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
    //   this.ratio = ratio
    //   this.canvasStyle =  { 
    //     width: canvas.width,
    //     height: canvas.height,
    //     style: {
    //       width: canvas.style.width,
    //       height: canvas.style.height
    //     }
    //   }
    //   var img=new Image()
    //   img.src = "../assets/back2.png"
    //   this._ctx.drawImage(image, 0, 0)
    //   let renderContext = {
    //     canvasContext: ctx,
    //     viewport: viewport
    //   }
    //   var renderTask = page.render(renderContext) 
    //   renderTask.promise.then(res => {
    //     this.canResize = true
    //   })
      
    //   this.initPoint(this.list)
    // },

    // loadPdf$p1(url) {

    //   let canvas = this.createLayer()
    //   if (this.page) {
    //     this.draw$p1(this.page)
    //   } else {
    //     PDFJS.getDocument(url).then((pdf) => {
    //       pdf.getPage(1).then(page => {
    //         this.draw$p1(page)
    //         this.page = page
    //       })
    //     }) 
    //   }
    // },

    // resize(scale) {
    //   if (scale == this.scale)
    //     return

    //   this.scale = scale
    //   this.canResize && this.draw$p1(this.page)
    // }
     
  },
  mounted() { 
     
    this.init()

    this.main.onmousedown = e => {
      this.currentCanvas = this.findLayer(e.pageX, e.pageY)  
      if (this.currentCanvas == null) {
        let canvas = this.createLayer()
        let label = 0
        if (this.points.length) {
          label = (this.points[this.points.length - 1].label || '') + 1
        }
        let params = {
          canvas: canvas,
          x: e.pageX,
          y: e.pageY,
          label: label
        }
        this.points.push({
          x: e.pageX,
          y: e.pageY,
          label: label
        })

        this.$emit('event', {
          instruction: 'insert-point',
          point: params
        })

        this.pointParams.push(params)
        this.drawPoints([params])
      } 
    }

    this.main.onmousemove = e => { 
      if (this.currentCanvas) {
        this.currentCanvas.x = e.pageX
        this.currentCanvas.y = e.pageY
        this.redraw(this.currentCanvas)
      } 
    }

    this.main.onmouseup = e => { 
      if (this.currentCanvas) {
        this.tempCanvas = this.currentCanvas.canvas
        
        this.$emit('event', {
          instruction: 'move-point',
          point: this.currentCanvas
        })
        
      }
        

      this.currentCanvas = null
    } 

    document.onkeydown = () => {
      var e = window.event; 
      if (e.keyCode == 8 || e.keyCode == 46) { 
        this.delPoint(this.tempCanvas)
      } 
      //  else if (e.keyCode == 81) {
        
      //   let scale  = this.scale - 0.4 
      //   this.resize(scale) 
      // } else if (e.keyCode == 87) { 
      //   let scale  = this.scale + 0.4
      //   this.resize(scale)
      // }
    }
  }
}
</script>
<style> 
  .log {
    position:fixed;
    left: 0;
    right: 0;
    width: 120px; 
    z-index: 10;
    background-color: rgba(0, 0, 0, 0.6);
    color: white; 
    size: 12px; 
    padding: 10px;
    border-top-right-radius: 12px;
    border-bottom-right-radius: 12px;
  }
  .panel {
    position:fixed;
    bottom: 0; 
    height: 140px;
    width: 80%;
    margin-left: 10%;
    background-color: rgba(0, 0, 0, 0.8);
    z-index: 15;
  }
</style>

<!-- Add "scoped" attribute to limit CSS to this component only -->
 