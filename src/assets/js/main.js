"use strict";

/**
 * TODO
 * Eğer izCards listesi boş ise form aktif olsun OK
 * form gönderildikten sonra ekletuşu pasif kalsın olsun ta ki cevap dönene kadar.
 * iz card listesinde en son güncellenen üste çıksın - sort mekanizması
 * iz card listesinin template haline getir ve for döngüsüne sok
 * localstorage ekle ve düzenleme sistemini yap - eklenti ile zor olursa direkt elle manuel yap gitsin.
 */
// Alpine Init
document.addEventListener('alpine:init', () => {
    Alpine.data('izCardManager', () => ({
        izCardInit: false,

        // init iz cards data from localstorage
        init() {
            if (Object.keys(this.izCards).length > 0) {
                this.newCardForm = false
            }
        },

        // Alert Box Show/Remove
        alertBox: false,
        alertType: "", // alert-success, alert-danger, danger-warning
        alertMessage: "",

        showAlertBox(type, message, ttl) {
            this.alertBox = true
            this.alertType = "alert-" + type
            this.alertMessage = message

            // ttl = -1 => 
            if (ttl > 0) {
                setTimeout(() => {
                    this.removeAlertBox()
                }, ttl)
            }
        },

        removeAlertBox() {
            this.alertBox = false
            this.alertType = ""
            this.alertMessage = ""
        },

        // new card form
        newCardForm: true,

        showNewCardForm() {
            this.newCardForm = true
        },

        removeNewCardForm() {
            this.newCardForm = false
        },

        // izmirim cards
        izCards: {},

        // card name with api data
        /**
         * {"card-number": {"cardName":"----", "liveData":"apiResponse"}}
         */
        addCard() {
            console.log("izCards", this.izCards)

            // card name and number data
            let cardName = document.getElementById("izCardName").value
            let cardNumber = document.getElementById("izCardNumber").value

            if (!this.izCards.hasOwnProperty(cardNumber)) {
                // disabled add button
                this.$el.setAttribute("disabled", "disabled")

                // cardNumber not found
                this.fetchCardDataFromApi(cardNumber)
                    .then(resp => resp.json())
                    .then(response => {
                        if (response.hasOwnProperty("HataVarMi") && !response.HataVarMi) {
                            // add card data
                            this._updateCardData(cardName, cardNumber, response)
    
                            console.log("izCards", this.izCards, this.$persist)
                            // TODO: add to localstorage before data has to make json stringfy

                            // remove new cardform
                            this.removeNewCardForm()

                            // undisabled add button
                            this.$el.removeAttribute("disabled")

                            // alert message
                            this.showAlertBox("success", "Kartlarım bölümüne başarılı şekilde eklendi.", 3000)
                        } else {
                            this.showAlertBox("warning", "Lütfen doğru kart numarasını giriniz.", 5000)
                        }
                    })
                    .catch(error => {
                        // undisabled add button
                        this.$el.removeAttribute("disabled")

                        // alert show error message
                        this.showAlertBox("danger", error.message, 3000)
                    })
            } else {
                // undisabled add button
                this.$el.removeAttribute("disabled")

                // alert show error message
                this.showAlertBox("warning", "Bu kart listenizde mevcut.", 3000)
            }
        },

        delCard() {
            let cardNumber = this.$el.getAttribute("data-card-number")

            // update card border
            this.toggleCardUpdate(cardNumber, "danger", 0)

            // remove cardData from izCards List
            delete this.izCards[cardNumber]

            // TODO: read to localstorage before data has to make json stringfy
        },

        getCard() {
            let cardNumber = this.$el.getAttribute("data-card-number")
            let refresh = this.$el.getAttribute("data-refresh")

            if (refresh === "true") {
                // cardNumber not found
                this.fetchCardDataFromApi(cardNumber)
                    .then(resp => resp.json())
                    .then(response => {
                        if (response.hasOwnProperty("HataVarMi") && !response.HataVarMi) {
                            // update card data
                            this._updateCardData(this.izCards[cardNumber].cardName, cardNumber, response)

                            // show card detail
                            // this.toggleCardDetail()

                            // update card border
                            this.toggleCardUpdate(cardNumber, "dark", 3000)

                            console.log("izCards", this.izCards, this.$persist)
                            // TODO: add to localstorage before data has to make json stringfy

                            return this.izCards[cardNumber]
                        } else {
                            this.showAlertBox("warning", "Şu an kart bakiye bilgisine ulaşılamıyor.", 5000)
                        }
                    })
                    .catch(error => {
                        // alert show error message
                        this.showAlertBox("danger", error.message, 3000)
                    })
            } else {
                return this.izCards[cardNumber]
            }
        },

        _updateCardData(cardName, cardNumber, cardData) {
            // update last update time
            let lastUpdateTime = this.__customDateParse(cardData.UlasimKartBakiyesi.SonIslemTarihi)
            let lastUpdateTime2 = this.__customDateParse(cardData.UlasimKartBakiyesi.SonYuklemeTarihi)
            console.log("Parse Date", lastUpdateTime, lastUpdateTime2)
            if (lastUpdateTime2 > lastUpdateTime) {
                lastUpdateTime = lastUpdateTime2
            }

            if (lastUpdateTime === null) {
                lastUpdateTime = 0
            }

            // update izCards object
            this.izCards[cardNumber] = {
                "cardName" : cardName,
                "liveData" : cardData.UlasimKartBakiyesi,
                "updateTime" : lastUpdateTime,
            }

            // sort card data
            this.izCards = Object.entries(this.izCards).sort((a,b) => {
                return b[1].updateTime - a[1].updateTime
            }).reduce((r, [k, v]) => ({ ...r, [k]: v }), {})
        },

        listCards() {
            return this.izCards
        },

        generateDetailSelector() {
            return 'detail-' + this.$el.getAttribute("data-card-number")
        },
        generateDeleteSelector() {
            return 'delete-' + this.$el.getAttribute("data-card-number")
        },
        toggleCardDetail() {
            let cardNumber = this.$el.getAttribute("data-card-number")

            // toggle card detail and delete button blocks
            document.getElementById("detail-" + cardNumber).classList.toggle("d-none");
            document.getElementById("delete-" + cardNumber).classList.toggle("d-none");
        },
        toggleCardUpdate(cardNumber, alertType, ttl) {
            let cardBlock = document.getElementById(cardNumber)

            cardBlock.classList.toggle("border-" + alertType)
            // ttl = -1 => 
            if (ttl > 0) {
                setTimeout(() => {
                    cardBlock.classList.toggle("border-" + alertType)
                }, ttl)
            }
        },

        // custom date: 17.08.2024 14:51:07 - dd.MM.yyyy HH:mm:ss
        __customDateParse(customDate) {
            console.log("customDate", customDate)
            if (customDate === 0 || customDate === null) {
                return 0
            }

            let strDate = customDate.replaceAll(".", "-").replace(/-/g,":").replace(/ /g,":").split(":")
            // year: number, monthIndex: number, date?: number, hours?: number, minutes?: number, seconds?: number, ms?: number
            let aDate = new Date(strDate[2], strDate[1]-1, strDate[0], strDate[3], strDate[4], strDate[5])
            
            console.log("aDate", aDate, aDate.getTime())
            return aDate.getTime()
        },

        // not use
        __splitDate() {
            let lastUpdateDate = this.$el.getAttribute("data-last-update")

            let updateDateArr = lastUpdateDate.split(" ")
            return updateDateArr.join("<br>")
        },

        // fetch card data from api response
        async fetchCardDataFromApi(cardNumber) {
            // https://openapi.izmir.bel.tr/api/iztek/bakiyesorgulama/{aliasNo}
            return await fetch("https://openapi.izmir.bel.tr/api/iztek/bakiyesorgulama/{aliasNo}".replace("{aliasNo}", cardNumber), {method: "GET"})
        }

        // utils
    }))
})

