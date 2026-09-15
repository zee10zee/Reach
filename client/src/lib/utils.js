

export function getToken(tokenName){
  const jsonToken = localStorage.getItem(tokenName)
  if(!jsonToken  || jsonToken === "undefined") return 
  return JSON.parse(jsonToken)
}


export function saveToken(tokenName,token){
  localStorage.setItem(tokenName,JSON.stringify(token))
}

export function formatDate(date){
    if(!date) return 'N/A'

   return new Date(date).toLocaleDateString('en-US', {
    weekday : 'short', 
    month : 'short',
    year : 'numeric'
   })
}

export function authenticateLocal(){
       const token = getToken('accessToken')
       if(!token) return window.location.href('/login')
}

export function getStoredBuddy() {
  try {
    const raw = localStorage.getItem('chatBuddy')
    return raw ? JSON.parse(raw) : 'buddy'
  } catch {
    return 'buddy'   // corrupt data → fall back
  }
}