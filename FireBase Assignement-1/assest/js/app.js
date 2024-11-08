import { auth, createUserWithEmailAndPassword, GoogleAuthProvider, provider, signInWithPopup, sendEmailVerification, signInWithEmailAndPassword, sendPasswordResetEmail, signOut, getFirestore, collection, addDoc, doc, setDoc, getDocs, db } from "./firebase.js";

//________________________________________________________signup__________________________________________________________

let signUp = () => {
    let email = document.getElementById("exampleInputEmail1").value;
    let password = document.getElementById("exampleInputPassword1").value;
    let emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    let passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
    let confirmPassword = document.getElementById("exampleInputConfirmPassword1").value;
    let firstName = document.getElementById("firstname").value;
    let lastName = document.getElementById("lastname").value;
    let dateOfBirth = document.getElementById("birthdate").value;
    let gender = document.querySelector("input[name='gender']:checked").value;

    let userData = { firstName, lastName, dateOfBirth, gender, email };
    console.log(userData);
    if (emailRegex.test(email) && passwordRegex.test(password)) {
        console.log("test");
        createUserWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {
                const user = userCredential.user;
                console.log(user);
                localStorage.setItem('user', JSON.stringify({
                    uid: user.uid,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: userData.lastName,
                    gender: user.gender,
                }));
                alert("Your Account Is Created Successfully");
                setTimeout(function(event)  {
                    window.location.href = "./email-validation.html";
                }, 2000);
                try {
                    await setDoc(doc(db, "users", user.uid), {
                        ...userData,
                        uID: user.uid
                    });
                    console.log("Document written with ID: ", user.uid);
                } catch (e) {
                    console.error("Error adding document: ", e);
                };

            })
            .catch((error) => {
                alert("The Error Is:"+errorCode)
                console.log(error.message);
            });
    }
    else {
        alert("Invalid email or Password");
      }
    if (password !== confirmPassword) {
        alert("Your Password Should Be Identical")
    }
};

if (window.location.pathname == "/assest/sign-up.html") {
    let signupBtn = document.getElementById("sign-up-btn");
    signupBtn.addEventListener("click", signUp);
}


// __________________________________________________signup with google___________________________________________________

let signupGoogle = () => {
    signInWithPopup(auth, provider)
        .then(async (result) => {
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            const user = result.user;
            console.log(user);
            window.location.href = "./email-validation.html"

            try {
                await setDoc(doc(db, "users", user.uid), {
                    ...userData,
                    uID: user.uid
                });
                console.log("Document written with ID: ", user.uid);
            } catch (e) {
                console.error("Error adding document: ", e);
            }

        })
        .catch((error) => {
            const email = error.customData.email;
            const credential = GoogleAuthProvider.credentialFromError(error);
            console.log(email, credential);
            // alert(error.code)
        });
}

if (window.location.pathname == "/assest/sign-up.html") {
    let signUpGoogleBtn = document.getElementById("sign-up-gmail-btn");
    signUpGoogleBtn.addEventListener("click", signupGoogle);
}

// ________________________________________________mail-verificaton_______________________________________________________

let sendMail = () => {
    sendEmailVerification(auth.currentUser)
        .then(async () => {
            alert("Email verification sent!");
            window.location.href = "./dashboard.html";
        }
        )
}

if (window.location.pathname == "/assest/email-validation.html") {
    let validation = document.getElementById("verify-email");
    validation.addEventListener("click", sendMail)
}

// ____________________________________________________log-in____________________________________________________________

let logIn = () => {
    const logEmail = document.getElementById("exampleInputEmail1").value;
    const logPassword = document.getElementById("exampleInputPassword1").value;
    signInWithEmailAndPassword(auth, logEmail, logPassword)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log(user);
            localStorage.setItem('user', JSON.stringify({
                uid: user.uid,
                email: user.email,
            }))
            alert("Log-In Successfully!")
            window.location.href = "./dashboard.html"
        })
        .catch((error) => {
            alert(error.code);
            console.log(error.message);
        });
}

if (window.location.pathname == "/assest/log-in.html") {
    let logBtn = document.getElementById("log-in-button")
    logBtn.addEventListener("click", logIn);
}

// _________________________________________forget password____________________________________________________________

let forgetPassword = () => {
    const forEmail = document.getElementById("exampleInputEmail1").value;
    sendPasswordResetEmail(auth, forEmail)
        .then(() => {
            alert("A Password Reset Link Has Been Seen In Your Email")
        })
        .catch((error) => {
            alert(error.code);
        })
}

if (window.location.pathname == "/assest/log-in.html") {
    let resetpass = document.querySelector(".forget-pass");
    resetpass.addEventListener("click", forgetPassword);
}

// __________________________________________sign-out_____________________________________________________________________

let logOut = () => {
    signOut(auth).then(() => {
        localStorage.removeItem('user');
        alert("Your account is successfully log-out")
        window.location.href = "../index.html"
    })
        .catch((error) => {
            alert(error.code)
        });
}

if (window.location.pathname == "/assest/dashboard.html") {
    let signout = document.getElementById("log-out")
    signout.addEventListener("click", logOut);
}

// ______________________________________________get user data in firestor________________________________________________

let getData= async () => {
    const querySnapshot = await getDocs(collection(db, "users"));
    querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => `,doc.data());
    });
};
getData();