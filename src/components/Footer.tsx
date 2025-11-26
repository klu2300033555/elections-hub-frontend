import { Vote } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t bg-muted/50 mt-auto">
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Vote className="h-5 w-5 text-primary" />
              <span className="font-bold">VoteSecure</span>
            </div>
            <p className="text-sm text-muted-foreground">
              A secure and transparent online voting platform for democratic elections.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>About Us</li>
              <li>How to Vote</li>
              <li>Security & Privacy</li>
              <li>FAQ</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Email: support@votesecure.com</li>
              <li>Phone: 1-800-VOTE-NOW</li>
              <li>Address: 123 Democracy Ave</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} VoteSecure. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
