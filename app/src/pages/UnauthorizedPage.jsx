import { Link } from "react-router-dom"
import { ShieldX } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card"

export function UnauthorizedPage() {
    return (
        <section className="mx-auto max-w-md px-4 py-16 flex items-center justify-center min-h-[50vh]">
            <Card className="w-full text-center shadow-lg p-4">
                <CardHeader className="space-y-4">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                        <ShieldX className="h-8 w-8 text-destructive" />
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight">
                        Acceso no autorizado
                    </CardTitle>
                    <CardDescription className="text-base max-w-xs mx-auto">
                        Su usuario no tiene permisos para ingresar a esta sección.
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                    <Button asChild className="w-full sm:w-auto px-8">
                        <Link to="/">
                            Regresar al inicio
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </section>
    )
}