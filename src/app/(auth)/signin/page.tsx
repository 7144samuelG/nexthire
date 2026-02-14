import { SignInForm } from "@/features/auth/components/signin-form";
import { requireunauth } from "@/lib/auth-utils";

const SignIn = async() => {
    await requireunauth();
    return  (<SignInForm/>) 
}
 
export default SignIn;