import Image from "next/image";
import Link from "next/link";

const AuthLayout = ({children}:{children:React.ReactNode}) => {
    return ( 
        <div className="min-h-svh flex flex-col justify-center items-center gap-6 p-6 md:p-10 bg-muted">
            <div className="flex w-full max-w-sm flex-col gap-6">
                <Link href="/" className="flex items-center gap-2 self-center font-medium">
                  <Image src="/logo.svg" height={50} width={50} alt="sgnbase"/>
                   NextHire
                </Link>
                {
                    children
                }
            </div>
        </div>
     );
}
 
export default AuthLayout;