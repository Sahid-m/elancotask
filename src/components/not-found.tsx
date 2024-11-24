import { Button } from "@/components/ui/button"
import { AlertTriangle } from 'lucide-react'
import Link from 'next/link'

interface NotFoundProps {
    message: string
}

export function NotFound({ message }: NotFoundProps) {
    return (
        <div className="min-h-screen bg-cream-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full">
                <AlertTriangle className="mx-auto text-red-500 w-16 h-16 mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Not Found</h2>
                <p className="text-gray-600 mb-6">{message}</p>
                <Link href="/" passHref>
                    <Button variant="secondary" className="w-full">
                        Back to Home
                    </Button>
                </Link>
            </div>
        </div>
    )
}

