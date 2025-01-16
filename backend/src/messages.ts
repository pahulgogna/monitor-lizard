

type EmailMessage = "verify" | "reset"

type getEmailMessage = ((type: EmailMessage, code?: string, userName?: string) => string)

export const outgoingMails: getEmailMessage = (type, code, userName) => {
    return type == "verify" ? `Hi,
    
    Thank you for signing up to Monitor Lizard! To complete your registration and verify your email address, please use the code below:
    
    Your Verification Code: ${code}
    
    If you didn't request this verification, you can safely ignore this email.
    
    Best regards,
    The Monitor Lizard Team
                    ` : "Hi " + userName + ",\nWe received a request to reset your password.\n\nClick the link below to reset it: \n\n" + ` ${process.env.FRONTEND_EP}/reset/${code} ` + "\n\nFor security reasons, this link will expire in 2 hours. If you didn’t request a password reset, please ignore this email. \n\nThank you,\nThe Monitor Lizard Team"
}