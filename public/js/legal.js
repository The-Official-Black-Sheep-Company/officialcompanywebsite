/**
 * legal.js
 * Handles the legal approval process for the Contacts section.
 */

const legalContent = {
    privacy: {
        title: "Privacy Policy",
        text: `
            <p>At The Official Black Sheep Company, your privacy is our priority. We collect only the information necessary to provide our services.</p>
            <h4>Information We Collect</h4>
            <ul>
                <li>Name and contact details when you reach out to us</li>
                <li>Service preferences and project requirements</li>
                <li>Payment information for completed services</li>
            </ul>
            <h4>How We Use Your Information</h4>
            <ul>
                <li>To provide and improve our services</li>
                <li>To communicate about your projects</li>
                <li>To process payments securely</li>
            </ul>
            <h4>Your Rights</h4>
            <p>You may request access to, correction of, or deletion of your personal data at any time by contacting us directly.</p>
        `
    },
    terms: {
        title: "Terms of Service",
        text: `
            <p>By using our services, you agree to the following terms:</p>
            <h4>Service Agreement</h4>
            <ul>
                <li>All service quotes are valid for 30 days unless otherwise stated</li>
                <li>Project timelines are estimates and may vary based on scope</li>
                <li>A deposit may be required before work begins</li>
            </ul>
            <h4>Payment Terms</h4>
            <ul>
                <li>Payment is due upon completion unless otherwise agreed</li>
                <li>We accept various payment methods including cash, card, and digital payments</li>
            </ul>
            <h4>Liability</h4>
            <p>The Official Black Sheep Company is insured and takes responsibility for the quality of our work. Any concerns should be raised within 48 hours of service completion.</p>
        `
    },
    disclaimer: {
        title: "Disclaimer",
        text: `
            <p>The information provided on this website is for general informational purposes only.</p>
            <h4>Service Availability</h4>
            <ul>
                <li>Services are subject to availability in your area</li>
                <li>Pricing may vary based on project specifics</li>
                <li>We reserve the right to decline service requests</li>
            </ul>
            <h4>Website Content</h4>
            <p>While we strive to keep information current, we make no warranties about the completeness, reliability, or accuracy of this information. Any action you take based on the information on this website is at your own risk.</p>
        `
    }
};

class LegalModal {
    constructor() {
        this.modal = document.getElementById('legal-modal');
        this.sidebar = this.modal?.querySelector('.modal-sidebar');
        this.body = this.modal?.querySelector('.modal-body');
        this.closeBtn = this.modal?.querySelector('.modal-close');
        this.approveBtn = document.getElementById('legal-approve-btn');
        this.approved = this.loadApproval();

        if (this.modal) this.init();
    }

    init() {
        // Sidebar navigation
        this.sidebar?.querySelectorAll('.legal-nav-item').forEach(item => {
            item.addEventListener('click', () => {
                this.sidebar.querySelectorAll('.legal-nav-item').forEach(n => n.classList.remove('active'));
                item.classList.add('active');
                this.showContent(item.dataset.section);
            });
        });

        // Close button
        this.closeBtn?.addEventListener('click', () => this.close());

        // Click outside to close
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.close();
        });

        // Approve button
        this.approveBtn?.addEventListener('click', () => {
            this.saveApproval();
            this.close();
        });

        // Show first section
        this.showContent('privacy');
    }

    showContent(section) {
        const content = legalContent[section];
        if (!content || !this.body) return;
        this.body.innerHTML = `<h2>${content.title}</h2>${content.text}`;
    }

    open() {
        if (!this.modal) return;
        this.modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    close() {
        if (!this.modal) return;
        this.modal.style.display = 'none';
        document.body.style.overflow = '';
    }

    saveApproval() {
        localStorage.setItem('legalApproved', 'true');
        this.approved = true;
    }

    loadApproval() {
        return localStorage.getItem('legalApproved') === 'true';
    }

    isApproved() {
        return this.approved;
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.legalModal = new LegalModal();

    // Wire up any "View Legal" buttons
    document.querySelectorAll('[data-action="open-legal"]').forEach(btn => {
        btn.addEventListener('click', () => window.legalModal.open());
    });
});
