import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';

interface TermsAndConditionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

const TermsAndConditionsModal: React.FC<TermsAndConditionsModalProps> = ({
  isOpen,
  onClose,
  onAccept,
}) => {
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isAtBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 10;
      setHasScrolledToBottom(isAtBottom);
    }
  };

  const handleAccept = () => {
    if (hasScrolledToBottom) {
      onAccept();
      onClose();
    }
  };

  const handleClose = () => {
    setHasScrolledToBottom(false);
    onClose();
  };

  // Reset scroll state when modal opens
  useEffect(() => {
    if (isOpen) {
      setHasScrolledToBottom(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Terms and Conditions</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto p-6 space-y-6"
        >
          <div className="text-sm text-gray-600 leading-relaxed">
            <p className="mb-4">
              Welcome to Publico, a blockchain-based web platform designed to enhance transparency and efficiency in Philippine local government transactions and services. By using our platform, you agree to be bound by these Terms and Conditions.
            </p>

            <div className="space-y-6">
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">1. Acceptance of Terms</h3>
                <p>
                  By accessing and using the Publico platform, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree to these terms, you must not use our services. These terms apply to all users including citizens, government agencies, public officials, auditors, NGOs, contractors, and suppliers.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">2. Description of Services</h3>
                <p>
                  Publico provides a secure, blockchain-based platform for government transactions including but not limited to:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                  <li>Budget allocation and disbursement tracking</li>
                  <li>Project proposal submission and management</li>
                  <li>Real-time budget utilization monitoring</li>
                  <li>Document management and verification</li>
                  <li>Smart contract-driven alerts and notifications</li>
                  <li>Public transparency portal for budget data</li>
                  <li>Audit trail and compliance reporting</li>
                </ul>
                <p className="mt-3">
                  All transactions are recorded on an immutable blockchain ledger to ensure transparency, security, and accountability in public administration.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">3. User Responsibilities</h3>
                <p>
                  As a user of the Publico platform, you are responsible for:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                  <li>Providing accurate and truthful information during registration and use</li>
                  <li>Maintaining the confidentiality of your account credentials</li>
                  <li>Complying with all applicable laws and regulations</li>
                  <li>Using the platform only for legitimate government and civic purposes</li>
                  <li>Reporting any suspicious activities or security breaches</li>
                  <li>Ensuring all submitted documents are authentic and properly authorized</li>
                  <li>Respecting the privacy and rights of other users</li>
                </ul>
                <p className="mt-3">
                  Government agencies must ensure all budget allocations and project submissions comply with existing Philippine government regulations and procedures.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">4. Privacy Policy and Data Protection</h3>
                <p>
                  Publico is committed to protecting your privacy and personal information. We collect and process data in accordance with the Data Privacy Act of 2012 (Republic Act No. 10173) and other applicable Philippine data protection laws.
                </p>
                <p className="mt-3">
                  <strong>Information We Collect:</strong> We collect information you provide during registration, including personal details, agency information, contact details, and uploaded documents. We also collect usage data and transaction records for audit and transparency purposes.
                </p>
                <p className="mt-3">
                  <strong>How We Use Information:</strong> Your information is used to provide platform services, verify identities, process transactions, generate audit reports, and maintain platform security. Some information may be made publicly available for transparency purposes as required by law.
                </p>
                <p className="mt-3">
                  <strong>Data Security:</strong> We implement industry-standard security measures including blockchain encryption, secure data storage, and access controls to protect your information from unauthorized access, alteration, or disclosure.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">5. Blockchain and Smart Contract Terms</h3>
                <p>
                  Publico utilizes blockchain technology and smart contracts to ensure transaction integrity and transparency. By using our platform, you acknowledge that:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                  <li>All transactions are recorded on an immutable blockchain ledger</li>
                  <li>Smart contracts execute automatically based on predefined conditions</li>
                  <li>Blockchain records cannot be altered or deleted once confirmed</li>
                  <li>You are responsible for understanding the implications of blockchain transactions</li>
                  <li>Network fees and transaction costs may apply for blockchain operations</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">6. Prohibited Activities</h3>
                <p>
                  You agree not to engage in any of the following prohibited activities:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                  <li>Attempting to hack, disrupt, or compromise the platform's security</li>
                  <li>Submitting false, fraudulent, or misleading information</li>
                  <li>Using the platform for illegal activities or corruption</li>
                  <li>Attempting to manipulate or falsify budget or transaction records</li>
                  <li>Violating any applicable laws or regulations</li>
                  <li>Interfering with other users' legitimate use of the platform</li>
                  <li>Attempting to reverse engineer or copy the platform's technology</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">7. Government Compliance</h3>
                <p>
                  All users must comply with applicable Philippine government laws and regulations, including but not limited to:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                  <li>Government Procurement Reform Act (Republic Act No. 9184)</li>
                  <li>Anti-Graft and Corrupt Practices Act (Republic Act No. 3019)</li>
                  <li>Code of Conduct and Ethical Standards for Public Officials (Republic Act No. 6713)</li>
                  <li>Local Government Code (Republic Act No. 7160)</li>
                  <li>Data Privacy Act (Republic Act No. 10173)</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">8. Limitation of Liability</h3>
                <p>
                  Publico provides the platform "as is" without warranties of any kind. We are not liable for any direct, indirect, incidental, or consequential damages arising from your use of the platform. However, we are committed to maintaining the highest standards of security and transparency in accordance with our mission to enhance government accountability.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">9. Termination</h3>
                <p>
                  We reserve the right to suspend or terminate your account if you violate these Terms and Conditions or engage in prohibited activities. Government agencies may be subject to additional compliance requirements and audit procedures. Upon termination, your access to the platform will be revoked, but blockchain records will remain immutable as required for transparency and audit purposes.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">10. Changes to Terms</h3>
                <p>
                  We may update these Terms and Conditions from time to time to reflect changes in our services or legal requirements. We will notify users of significant changes through the platform or via email. Continued use of the platform after changes constitutes acceptance of the updated terms.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">11. Contact Information</h3>
                <p>
                  For questions about these Terms and Conditions or the Publico platform, please contact us at:
                </p>
                <div className="mt-3 bg-gray-50 p-4 rounded-lg">
                  <p><strong>Email:</strong> support@publico.com</p>
                  <p><strong>Phone:</strong> +63 (2) 123-4567</p>
                  <p><strong>Address:</strong> Publico Support Center, Manila, Philippines</p>
                </div>
              </section>

              <div className="border-t border-gray-200 pt-6">
                <p className="text-sm text-gray-500">
                  <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  By accepting these terms, you acknowledge that you have read and understood all sections of this agreement and agree to be bound by its terms and conditions.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={hasScrolledToBottom}
              readOnly
              className="accent-[#2563eb]"
            />
            <span className={hasScrolledToBottom ? "text-gray-900" : "text-gray-500"}>
              I have read and agree to the terms and conditions
            </span>
          </label>
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAccept}
              disabled={!hasScrolledToBottom}
              className={`px-4 py-2 text-sm font-medium text-white rounded-md transition-colors ${
                hasScrolledToBottom
                  ? 'bg-[#2563eb] hover:bg-[#1d4fd8]'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              Agree
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditionsModal;
