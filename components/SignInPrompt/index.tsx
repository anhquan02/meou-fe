
import { Button } from "@material-tailwind/react"
import Link from "next/link"

const SignInPrompt = () => {
  return (
    <div className="bg-white flex items-start justify-between">
      <div>
        <h2 className="text-xl-semi">Bạn đã có tài khoản</h2>
        <p className="text-base-regular text-gray-700 mt-2">
          Đăng nhập để có trải nghiệm tốt hơn
        </p>
      </div>
      <div>
        <Link href="#">
          <Button >Đăng nhập</Button>
        </Link>
      </div>
    </div>
  )
}

export default SignInPrompt
