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
                // cardNumber not found
                this.fetchCardDataFromApi(cardNumber)
                    .then(resp => resp.json())
                    .then(response => {
                        if (response.hasOwnProperty("HataVarMi") && !response.HataVarMi) {
                            // add card data
                            this.izCards[cardNumber] = {
                                "cardName": cardName,
                                "liveData" : response
                            }
    
                            console.log("izCards", this.izCards, this.$persist)
                            // TODO: add to localstorage before data has to make json stringfy

                            // remove new cardform
                            this.removeNewCardForm()

                            // alert message
                            this.showAlertBox("success", "Kartlarım bölümüne başarılı şekilde eklendi.", 3000)
                        } else {
                            this.showAlertBox("warning", "Lütfen doğru kart numarasını giriniz.", 5000)
                        }
                    })
                    .catch(error => {
                        // alert show error message
                        this.showAlertBox("danger", error.message, 3000)
                    })
            } else {
                // alert show error message
                this.showAlertBox("warning", "Bu kart listenizde mevcut.", 3000)
            }
        },

        delCard(cardNumber) {
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
                        // update card data
                        this.izCards[cardNumber]["liveData"] = response

                        // show card detail
                        // this.toggleCardDetail()

                        // update card border
                        this.toggleCardUpdate(cardNumber)

                        // TODO: add to localstorage before data has to make json stringfy

                        return this.izCards[cardNumber]
                    })
                    .catch(error => {
                        // alert show error message
                        this.showAlertBox("danger", error.message, 3000)
                    })
            } else {
                return this.izCards[cardNumber]
            }
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
        toggleCardUpdate(cardNumber) {
            let cardBlock = document.getElementById(cardNumber)

            cardBlock.classList.toggle("border-dark")
            setTimeout(() => {
                cardBlock.classList.toggle("border-dark")
            }, 3000)
        },

        // not use
        splitDate() {
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

