
export const validate = (data: any) => {
    const errors: any = {};
    let emailPattern = new RegExp(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
    // let namePattern = new RegExp(/^[a-zA-Z\-]+$/);  
    // let phonePattern = new RegExp(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/g);

    // let passwordPpattern = new RegExp(
    // "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\\\$%\\\\^&\\\\*])(?=.{8,})"
    // );  
    if (!data.firstName) {
      errors.firstName = "first name is required";
    }
    if (!data.lastName) {
      errors.lastName = "last name is required";
    }
    if (!data.identifier) {
      errors.identifier = "email is required";
    } else if (!emailPattern.test(data.identifier)) {
      errors.identifier = "invalid email";
    }

    if (!data.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      errors.email = "Email is invalid";
    }

    if (!data.password) {
      errors.password = "Password is required";
    } else if (data.password.length < 6) {
      errors.password = "Password must be at least 6 characters long";
    }else if (
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(data.password)
    ) {
      errors.password =
        "Password must contain at least one uppercase letter, one lowercase letter, one number, one special character";
    }

    if (!data.passwordConfirmation) {
      errors.passwordConfirmation = "Password is required";
    } else if (data.passwordConfirmation.length < 6) {
      errors.passwordConfirmation = "Password must be at least 6 characters long";
    } else if(data.passwordConfirmation != data.currentPassword ){
      errors.passwordConfirmation = "password do not much";
    }

    if (!data.currentPassword) {
      errors.currentPassword = "Password is required";
    } else if (data.currentPassword.length < 6) {
      errors.currentPassword = "Password must be at least 6 characters long";
    }
   
    return errors;
  };
