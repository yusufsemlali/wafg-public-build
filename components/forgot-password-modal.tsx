"use client"

import { useRouter } from "next/navigation"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { ForgotPasswordForm } from "@/components/forgot-password-form"

export function ForgotPasswordModal() {
  const router = useRouter()

  return (
    <Dialog open={true} onOpenChange={() => router.back()}>
      <DialogContent className="sm:max-w-[425px]">
        <ForgotPasswordForm />
      </DialogContent>
    </Dialog>
  )
}
