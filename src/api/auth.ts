export type loginPayload = {
    email:string,
    password:string,
}

export type signupPayload = {
    fname:string,
    lname:string,
    firstName:string,
    lastName:string,
    email:string,
    password:string,
    role:string|undefined,
}

export const loginHandler = async(payload:loginPayload) => {
    console.log("Login payload:", );
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/login`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }) 
}

export const signupHandler = async(payload:signupPayload) => {
    console.log("payload",payload);
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/user`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: payload.email,
    role: "CUSTOMER",
    fname: payload.firstName,
    lname: payload.lastName,
    password:payload.password
        }),
      }) 
}