import { Mail, MessageCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-20">
      <h1 className="font-display text-3xl font-semibold text-ink">Contact us</h1>
      <p className="mt-4 text-ink-muted">We usually reply within one business day.</p>
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="flex items-start gap-3 p-5">
            <Mail className="h-5 w-5 text-brand" />
            <div>
              <p className="font-medium text-ink">Email</p>
<<<<<<< HEAD
              <a href="mailto:accewaai@gmail.com" className="text-sm text-brand hover:underline">
                accewaai@gmail.com
=======
              <a href="mailto:support@Accewa.com" className="text-sm text-brand hover:underline">
                support@Accewa.com
>>>>>>> 3a9bca51b6c02abe374fb51540c359783f274e15
              </a>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-start gap-3 p-5">
            <MessageCircle className="h-5 w-5 text-brand" />
            <div>
              <p className="font-medium text-ink">In-app chat</p>
              <p className="text-sm text-ink-muted">Signed-in customers can reach us from the Help Center.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

