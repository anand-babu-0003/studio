import { PageHeader } from '@/components/shared/page-header';
import { ContactForm } from '@/components/contact/contact-form';
import { ContactInfo } from '@/components/contact/contact-info';
import { Card, CardContent } from '@/components/ui/card';

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 animate-fadeInUp-1">
      <PageHeader 
        title="Get in Touch"
        subtitle="Have a project in mind, a question, or just want to say hi? I'd love to hear from you."
      />

      <div className="grid lg:grid-cols-5 gap-12">
        <div className="lg:col-span-3">
          <Card className="shadow-xl p-6 sm:p-8">
            <CardContent className="p-0">
              <ContactForm />
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-2">
           <Card className="shadow-xl p-6 sm:p-8 bg-primary/5">
            <CardContent className="p-0">
              <ContactInfo />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
