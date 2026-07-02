import { Card, CardContent } from "./ui/card";

const Footer = () => {
  return (
    <footer className="mt-5">
      <Card className="px-3 py-5">
        <CardContent>
          <p className="text-gray-400">@2026 Copyright FSW Barber</p>
        </CardContent>
      </Card>
    </footer>
  );
};

export default Footer;
