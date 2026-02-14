import { SignUpForm } from "@/features/auth/components/signup-form";
import { requireunauth } from "@/lib/auth-utils";

const SignUp = async() => {
    await requireunauth();
    return <SignUpForm/>
}
 
export default SignUp;