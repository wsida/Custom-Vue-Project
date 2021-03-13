import CryptoJS from 'crypto-js'

const AES_KEY = 'wsd-aes-key-888'

export const decrypt = (ciphertext) => {
  return CryptoJS.AES.decrypt(ciphertext, AES_KEY)
}

export const encrypt = (plaintext) => {
  return CryptoJS.AES.encrypt(plaintext, AES_KEY)
}
