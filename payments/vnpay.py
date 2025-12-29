import hmac
import hashlib
import urllib.parse

class VNPay:
    requestData = {}
    responseData = {}

    def get_payment_url(self, base_url, secret_key):
        inputData = sorted(self.requestData.items())
        queryString = ''
        hasData = ''
        seq = 0

        for key, val in inputData:
            encoded_val = urllib.parse.quote_plus(str(val))
            if seq == 1:
                queryString += "&" + key + "=" + encoded_val
            else:
                seq = 1
                queryString = key + "=" + encoded_val

        hashValue = self.__hmacsha512(secret_key, queryString)
        return base_url + "?" + queryString + "&vnp_SecureHash=" + hashValue

    def validate_response(self, secret_key):
        vnp_SecureHash = self.responseData.pop("vnp_SecureHash", None)
        self.responseData.pop("vnp_SecureHashType", None)

        inputData = sorted(self.responseData.items())
        hasData = ''
        seq = 0
        for key, val in inputData:
            if key.startswith("vnp_"):
                encoded_val = urllib.parse.quote_plus(str(val))
                if seq == 1:
                    hasData += "&" + key + "=" + encoded_val
                else:
                    seq = 1
                    hasData = key + "=" + encoded_val

        hashValue = self.__hmacsha512(secret_key, hasData)

        return vnp_SecureHash == hashValue

    @staticmethod
    def __hmacsha512(key, data):
        return hmac.new(key.encode('utf-8'), data.encode('utf-8'), hashlib.sha512).hexdigest()
