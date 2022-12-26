const CryptoJS = require('crypto-js')
const { ValidatePhone, notEmpty, validatePinCode, ValidateEmail } = require('../../utills/functions.js')
const User = require('../../modals/User');
const Order = require('../../modals/Order.js');
const stripe = require('stripe')("sk_test_51MJ9NfSF8MhYykNnjdHHPgThu2CT64rUpjjfSFqRvDqfEh1RGRmUcbRDyDBAVkatScu1CpfC5GQV2ekDu8nDO3wX000RAOUPSl")

const orderController = () => {

    let ciphertext = '';

    function decrypt(data){
        const bytes  = CryptoJS.AES.decrypt(data, process.env.SECRET)
        const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
        return decryptedData
    }

    return {
        async placeOrder(req,res){
            const { data }  = req.body
            const {checkOutDetails,token } = data //decrypt(data)

            try {
                 // verification
                if(ValidatePhone(checkOutDetails.phone)  && notEmpty(checkOutDetails.address) 
                && notEmpty(checkOutDetails.city) && validatePinCode(checkOutDetails.pinCode)){

                    const user = await User.findOne({ email:checkOutDetails.email })
                    
                    if(token){

                        const result = await stripe.paymentIntents.create({
                            amount: checkOutDetails.TotalPrice  * 100,
                            currency: 'inr',
                            payment_method: token,
                            description: `Food order: ${user._id}`,
                            confirm:true
                        });

                        const customer = stripe.customers
                        .create({
                          email: 'customer@example.com',
                        })
                        .then((customer) => {
                          // have access to the customer object
                          return stripe.invoiceItems
                            .create({
                                customerId:user._id,
                              amount: checkOutDetails.TotalPrice, // 25
                              currency: 'inr',
                              description: `Food order: ${user._id}`,
                            })
                            .then((invoiceItem) => {
                              return stripe.invoices.create({
                                collection_method: 'send_invoice',
                                customer: invoiceItem.customer,
                              });
                            })
                            .then((invoice) => {
                                console.log(invoice);
                              // New invoice created on a new customer
                            })
                            .catch((err) => {
                                console.log(error);
                              // Deal with an error
                            });
                        });
                    }
                    const order = new Order({
                        customerId:user._id,
                        items:checkOutDetails.orders,
                        phone:checkOutDetails.phone,
                        address:checkOutDetails.address,
                        city:checkOutDetails.city,
                        totalPrice:checkOutDetails.TotalPrice,
                        pinCode:checkOutDetails.pinCode,
                        paymentType:token ? 'card':'cod',
                        paymentStatus:true,
                    });
                    const response = await order.save()

                    if(response){
                        // ciphertext = await CryptoJS.AES.encrypt(JSON.stringify({success:'Order Placed Successfully'}),process.env.SECRET).toString()
                        return res.send({success:'Order Placed Successfully'})
                    } 
                }
                    
            } catch (error) {
                    console.log(error);
                    // ciphertext = await CryptoJS.AES.encrypt(JSON.stringify({error:'Something Went Wrong...'}),process.env.SECRET).toString()
                    return res.send({error:'Something Went Wrong...'})
            }
        },
        async order(req,res){

            const { data }  = req.body
            console.log(data);
            const { email } = data //decrypt(data)

            try {
                 // verification
                if(ValidateEmail(email)){

                    const user = await User.findOne({ email })
                    
                    const orders = await Order.find({ customerId:user._id },
                        null,
                        { sort: { 'createdAt': -1 } }
                        )

                    if(orders){
                        // ciphertext = await CryptoJS.AES.encrypt(JSON.stringify(orders),process.env.SECRET).toString()
                        return res.send(orders)
                    }
                    // ciphertext = await CryptoJS.AES.encrypt(JSON.stringify({success:'No Orders Yet'}),process.env.SECRET).toString()
                    return res.send({success:'No Orders Yet'})
                }
                    
            } catch (error) {
                    console.log(error);
                    // ciphertext = await CryptoJS.AES.encrypt(JSON.stringify({error:'Something Went Wrong...'}),process.env.SECRET).toString()
                    return res.send({error:'Something Went Wrong...'})
            }

        },
        async getSingleOrder(req,res){

            const { data }  = req.body
            const { email,id } = data //decrypt(data)

            try {
                 // verification
                if(ValidateEmail(email)){

                    const user = await User.findOne({ email })
                    
                    const order = await Order.findById(id)

                    if(order && user){
                        // ciphertext = CryptoJS.AES.encrypt(JSON.stringify(order),process.env.SECRET).toString()
                        return res.send(JSON.stringify(order))
                    }
                    // ciphertext = CryptoJS.AES.encrypt(JSON.stringify({success:'No Orders Yet'}),process.env.SECRET).toString()
                    return res.send({success:'No Orders Yet'})
                }
                    
            } catch (error) {
                    console.log(error);
                    // ciphertext = CryptoJS.AES.encrypt(JSON.stringify({error:'Something Went Wrong...'}),process.env.SECRET).toString()
                    return res.send({error:'Something Went Wrong...'})
            }

        }

    }
}

module.exports = orderController