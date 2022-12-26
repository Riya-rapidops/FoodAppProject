import emailjs from "emailjs-com";
require("dotenv").config();

export const SendEmail = (Mail_data) => {
  return emailjs.send(
    'service_yngu28g',
    'template_ee6eb73',
    Mail_data,
    'IZCUb8IpfQB6g5Hzj'
  );
};
