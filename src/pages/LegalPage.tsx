import { SEOHead, SITE_URL } from "@/components/SEOHead";

export default function LegalPage() {
  return (
    <>
      <SEOHead
        title="Terms of Service & Privacy Policy — Things Done."
        description="Terms of Service and Privacy Policy for Things Done, the GTD® task manager. Last updated March 9, 2026."
        canonical={`${SITE_URL}/legal`}
      />

      <article className="mx-auto max-w-2xl px-6 py-16 md:py-24">
        <h1 className="font-display text-3xl leading-tight text-foreground sm:text-4xl">
          Terms of Service &amp; Privacy Policy
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">Last updated: March 9, 2026</p>

        <div className="prose-custom mt-10 space-y-8 text-[15px] leading-relaxed text-foreground/90">
          {/* 1 */}
          <section>
            <h2 className="text-xl font-semibold text-foreground">1. Introduction</h2>
            <p>
              Welcome to Things Done. ("Things Done," "we," "us," or "our"). Things Done is a web-based task management application available at{" "}
              <a href="https://things-done.app" className="text-primary hover:underline">things-done.app</a>.
            </p>
            <p>
              By creating an account or using Things Done, you agree to these Terms of Service and Privacy Policy. If you don't agree, please don't use the service.
            </p>
            <p>These terms are written in plain language because we believe you should understand what you're agreeing to.</p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="text-xl font-semibold text-foreground">2. The Service</h2>
            <p>
              Things Done is a productivity tool that helps you capture tasks, organize projects, and manage your work using principles from the Getting Things Done® (GTD®) methodology. We offer a free tier and a paid Pro plan.
            </p>
            <p>
              We reserve the right to modify, suspend, or discontinue any part of the service at any time. If we make changes that materially affect your use of Things Done, we'll notify you via the email address associated with your account.
            </p>
          </section>

          {/* 3 */}
          <section>
            <h2 className="text-xl font-semibold text-foreground">3. Your Account</h2>
            <p>You are responsible for maintaining the confidentiality of your account credentials. You agree to provide accurate information when creating your account and to keep it up to date.</p>
            <p>You must be at least 13 years old to use Things Done. If you are under 18, you represent that you have your parent or guardian's consent.</p>
            <p>We may suspend or terminate your account if you violate these terms or use the service in a way that could harm other users or the service itself.</p>
          </section>

          {/* 4 */}
          <section>
            <h2 className="text-xl font-semibold text-foreground">4. Your Data &amp; Content</h2>
            <p><strong>You own your data.</strong> Any tasks, projects, notes, or other content you create in Things Done belongs to you. We do not claim ownership of your content.</p>
            <p>You grant us a limited license to store, process, and display your content solely for the purpose of operating and improving the service. We will not sell, rent, or share your content with third parties except as described in this policy.</p>
            <p><strong>Data portability:</strong> You can export your data at any time. If you delete your account, we will delete your data from our active systems within 30 days. Backups may retain your data for up to 90 days before being purged.</p>
          </section>

          {/* 5 */}
          <section>
            <h2 className="text-xl font-semibold text-foreground">5. Payment &amp; Billing</h2>
            <p><strong>Free plan:</strong> No payment required. Free plans may have usage limits (number of tasks, projects, AI reviews, etc.) as described on our Pricing page.</p>
            <p><strong>Pro plan:</strong> Billed monthly at the rate shown on our Pricing page. Payments are processed securely through Stripe. We do not store your full credit card number — Stripe handles all payment data.</p>
            <p><strong>Cancellation:</strong> You can cancel your Pro subscription at any time from your account settings. You'll retain Pro access until the end of your current billing period. We do not offer prorated refunds for partial months.</p>
            <p><strong>Price changes:</strong> If we change our pricing, we'll give you at least 30 days' notice. The new price will apply at your next billing cycle after the notice period.</p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="text-xl font-semibold text-foreground">6. Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-5 space-y-1 text-foreground/90">
              <li>Use Things Done for any unlawful purpose</li>
              <li>Attempt to access other users' accounts or data</li>
              <li>Interfere with or disrupt the service or its infrastructure</li>
              <li>Use automated tools to scrape or bulk-access the service</li>
              <li>Upload content that is malicious, harmful, or infringes on others' rights</li>
            </ul>
            <p>We reserve the right to remove content or suspend accounts that violate these terms.</p>
          </section>

          {/* 7 */}
          <section>
            <h2 className="text-xl font-semibold text-foreground">7. AI Features</h2>
            <p>Things Done includes optional AI-powered features (weekly review assistance, brain dump capture, task suggestions). These features process your task data to provide personalized suggestions.</p>
            <ul className="list-disc pl-5 space-y-1 text-foreground/90">
              <li>AI processing is performed using third-party AI services</li>
              <li>Your task content may be sent to these services for processing, but is not used to train their models</li>
              <li>AI features are optional and can be avoided by not using the AI review or brain dump features</li>
              <li>AI-generated suggestions are just that — suggestions. You remain in full control of your tasks and organization</li>
            </ul>
          </section>

          {/* 8 */}
          <section>
            <h2 className="text-xl font-semibold text-foreground">8. Availability &amp; Warranties</h2>
            <p>We strive to keep Things Done available and reliable, but we provide the service "as is" without warranties of any kind, express or implied.</p>
            <p>We do not guarantee that the service will be uninterrupted, error-free, or that any defects will be corrected. We are not responsible for any data loss, though we take reasonable precautions to prevent it (see Data Security below).</p>
          </section>

          {/* 9 */}
          <section>
            <h2 className="text-xl font-semibold text-foreground">9. Limitation of Liability</h2>
            <p>To the maximum extent permitted by law, Things Done and its operator shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of data, profits, or revenue, arising from your use of or inability to use the service.</p>
            <p>Our total liability for any claims related to the service shall not exceed the amount you paid us in the 12 months preceding the claim, or $50, whichever is greater.</p>
          </section>

          {/* 10 */}
          <section>
            <h2 className="text-xl font-semibold text-foreground">10. Changes to These Terms</h2>
            <p>We may update these terms from time to time. If we make material changes, we'll notify you by email or by posting a notice on the service. Your continued use of Things Done after changes take effect constitutes your acceptance of the revised terms.</p>
          </section>

          {/* Privacy Policy header */}
          <hr className="border-border" />
          <h2 className="text-2xl font-semibold text-foreground !mt-10">Privacy Policy</h2>

          {/* 11 */}
          <section>
            <h2 className="text-xl font-semibold text-foreground">11. What We Collect</h2>
            <p><strong>Account information:</strong> Email address and name (provided during signup or via Google OAuth).</p>
            <p><strong>Task data:</strong> Tasks, projects, notes, contexts, tags, and any other content you create within Things Done. This data is stored to provide you with the service.</p>
            <p><strong>Usage data:</strong> Basic analytics such as pages visited, features used, and general usage patterns. We use this to understand how people use Things Done and to improve the product.</p>
            <p><strong>Payment data:</strong> If you subscribe to Pro, Stripe collects and processes your payment information. We receive only a partial card number and billing status — never your full card details.</p>
            <p><strong>Technical data:</strong> IP address, browser type, device type, and operating system. This is collected automatically for security and troubleshooting purposes.</p>
          </section>

          {/* 12 */}
          <section>
            <h2 className="text-xl font-semibold text-foreground">12. How We Use Your Data</h2>
            <p>We use your data to:</p>
            <ul className="list-disc pl-5 space-y-1 text-foreground/90">
              <li>Provide, maintain, and improve Things Done</li>
              <li>Process your payments (via Stripe)</li>
              <li>Send you important service-related communications (account changes, security alerts, billing)</li>
              <li>Provide AI-powered features when you choose to use them</li>
              <li>Analyze usage patterns to improve the product (in aggregate, not individually)</li>
            </ul>
            <p className="mt-3">We do <strong>not</strong>:</p>
            <ul className="list-disc pl-5 space-y-1 text-foreground/90">
              <li>Sell your personal data to anyone</li>
              <li>Share your data with advertisers</li>
              <li>Use your task content for marketing purposes</li>
              <li>Allow third parties to access your individual data, except as needed to operate the service (see Third-Party Services below)</li>
            </ul>
          </section>

          {/* 13 */}
          <section>
            <h2 className="text-xl font-semibold text-foreground">13. Third-Party Services</h2>
            <p>We use the following third-party services to operate Things Done:</p>
            <ul className="list-disc pl-5 space-y-1 text-foreground/90">
              <li><strong>Supabase</strong> — Database and authentication. Your account data and task content are stored on Supabase's infrastructure. <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Supabase Privacy Policy</a></li>
              <li><strong>Stripe</strong> — Payment processing for Pro subscriptions. <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Stripe Privacy Policy</a></li>
              <li><strong>AI service provider</strong> — Processes task content when you use AI features (weekly review, brain dump). Content is sent for processing only and is not retained by the provider for training.</li>
            </ul>
            <p>We choose providers that maintain strong security and privacy practices, but we encourage you to review their policies.</p>
          </section>

          {/* 14 */}
          <section>
            <h2 className="text-xl font-semibold text-foreground">14. Data Security</h2>
            <p>We take reasonable measures to protect your data:</p>
            <ul className="list-disc pl-5 space-y-1 text-foreground/90">
              <li>All data is transmitted over HTTPS (encrypted in transit)</li>
              <li>Data is encrypted at rest in our database</li>
              <li>Authentication is handled securely via Supabase Auth</li>
              <li>We use row-level security to ensure users can only access their own data</li>
              <li>We do not store passwords in plaintext — authentication is handled via secure hashing or OAuth providers</li>
            </ul>
            <p>No system is perfectly secure. If we discover a data breach that affects your personal information, we will notify you promptly.</p>
          </section>

          {/* 15 */}
          <section>
            <h2 className="text-xl font-semibold text-foreground">15. Cookies</h2>
            <p>Things Done uses essential cookies required for authentication and session management. We do not use advertising cookies or third-party tracking cookies.</p>
            <p>If we add analytics in the future, we will update this policy and seek your consent where required.</p>
          </section>

          {/* 16 */}
          <section>
            <h2 className="text-xl font-semibold text-foreground">16. Your Rights</h2>
            <p>Depending on where you live, you may have the right to:</p>
            <ul className="list-disc pl-5 space-y-1 text-foreground/90">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Delete your account and data</li>
              <li>Export your data in a portable format</li>
              <li>Object to certain data processing</li>
            </ul>
            <p>To exercise any of these rights, contact us at{" "}
              <a href="mailto:levijohnson@gmail.com" className="text-primary hover:underline">levijohnson@gmail.com</a>.
              We will respond within 30 days.
            </p>
          </section>

          {/* 17 */}
          <section>
            <h2 className="text-xl font-semibold text-foreground">17. Children's Privacy</h2>
            <p>Things Done is not directed at children under 13. We do not knowingly collect personal information from children under 13. If you believe a child under 13 has created an account, please contact us and we will delete it promptly.</p>
          </section>

          {/* 18 */}
          <section>
            <h2 className="text-xl font-semibold text-foreground">18. Data Retention</h2>
            <p><strong>Active accounts:</strong> We retain your data for as long as your account is active.</p>
            <p><strong>Deleted accounts:</strong> We delete your data from active systems within 30 days of account deletion. Backups are purged within 90 days.</p>
            <p><strong>Payment records:</strong> We retain billing records as required by tax and accounting regulations.</p>
          </section>

          {/* 19 */}
          <section>
            <h2 className="text-xl font-semibold text-foreground">19. International Users</h2>
            <p>Things Done is operated from the United States. If you use the service from outside the US, your data will be transferred to and processed in the United States. By using the service, you consent to this transfer.</p>
          </section>

          {/* 20 */}
          <section>
            <h2 className="text-xl font-semibold text-foreground">20. Contact</h2>
            <p>If you have questions about these terms or your privacy, contact us at:</p>
            <p><strong>Email:</strong>{" "}
              <a href="mailto:levijohnson@gmail.com" className="text-primary hover:underline">levijohnson@gmail.com</a>
            </p>
            <p className="mt-4 text-sm text-muted-foreground">These Terms of Service and Privacy Policy are effective as of March 9, 2026.</p>
          </section>
        </div>
      </article>
    </>
  );
}
