export function Footer() {
    const currentYear = new Date().getFullYear();
    return (
        <footer className="border-t border-border bg-card text-card-foreground text-center p-6 mt-auto">
            <div className="mx-auto max-w-6xl">
                <p className="text-sm text-muted-foreground">
                    © {currentYear}{" "}
                    <span className="text-primary font-medium">ISW-613</span>.
                    Casi todos los derechos reservados.
                </p>
            </div>
        </footer>
    );
}
