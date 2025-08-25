// Payment Validation System
class PaymentValidator {
    static validateCardNumber(cardNumber) {
        const cleanNumber = cardNumber.replace(/\s/g, '');
        return this.luhnCheck(cleanNumber) && cleanNumber.length >= 13;
    }

    static luhnCheck(cardNumber) {
        let sum = 0;
        let alternate = false;
        
        for (let i = cardNumber.length - 1; i >= 0; i--) {
            let n = parseInt(cardNumber.charAt(i), 10);
            
            if (alternate) {
                n *= 2;
                if (n > 9) {
                    n = (n % 10) + 1;
                }
            }
            
            sum += n;
            alternate = !alternate;
        }
        
        return (sum % 10) === 0;
    }

    static validateExpiryDate(expiry) {
        const [month, year] = expiry.split('/');
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear() % 100;
        const currentMonth = currentDate.getMonth() + 1;
        
        if (month && year) {
            const monthNum = parseInt(month, 10);
            const yearNum = parseInt(year, 10);
            
            if (monthNum >= 1 && monthNum <= 12) {
                return yearNum > currentYear || (yearNum === currentYear && monthNum >= currentMonth);
            }
        }
        
        return false;
    }

    static isTestCard(cardNumber) {
        const testCards = [
            '4111111111111111', '4000000000000002', '5555555555554444',
            '2223003122003222', '378282246310005', '371449635398431',
            '6011111111111117', '6011000990139424'
        ];
        
        return testCards.includes(cardNumber) || 
               /^(1234|0000|9999)/.test(cardNumber) ||
               cardNumber === '1111111111111111' ||
               /^(\d)\1+$/.test(cardNumber);
    }

    static validatePaymentForm(formData) {
        const email = formData.get('email');
        const firstName = formData.get('firstName');
        const lastName = formData.get('lastName');
        const cardNumber = formData.get('cardNumber')?.replace(/\s/g, '');
        const expiry = formData.get('expiry');
        const cvv = formData.get('cvv');
        
        if (!email || !firstName || !lastName) {
            return { isValid: false, error: 'Please fill in all required fields' };
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return { isValid: false, error: 'Please enter a valid email address' };
        }
        
        if (!cardNumber || !this.validateCardNumber(cardNumber)) {
            return { isValid: false, error: 'Please enter a valid card number' };
        }
        
        if (this.isTestCard(cardNumber)) {
            return { isValid: false, error: 'Test card numbers are not allowed for real purchases' };
        }
        
        if (!expiry || !this.validateExpiryDate(expiry)) {
            return { isValid: false, error: 'Please enter a valid expiry date' };
        }
        
        if (!cvv || cvv.length < 3) {
            return { isValid: false, error: 'Please enter a valid CVV' };
        }
        
        return { isValid: true };
    }
}