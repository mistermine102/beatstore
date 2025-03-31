<template>
  <div class="container mx-auto px-4 py-8 max-w-4xl">
    <h1 class="text-3xl font-bold text-center mb-6">Privacy Policy</h1>

    <div class="text-center text-textLightGrey mb-8">
      <p>Effective Date: <span class="placeholder">27.03.2025</span></p>
    </div>

    <div>
      <div v-for="(section, index) in sections" :key="index" class="panel mb-8">
        <h2 class="text-2xl font-bold pb-3 mb-4">{{ section.number }}. {{ section.title }}</h2>

        <div v-if="section.content" class="mb-4 text-textLightGrey">
          <p>{{ section.content }}</p>
        </div>

        <ul v-if="section.points" class="list-disc list-outside pl-5 space-y-2 text-textLightGrey">
          <li v-for="(point, pointIndex) in section.points" :key="pointIndex">
            {{ point }}
          </li>
        </ul>

        <div v-if="section.subsections" class="ml-4">
          <div v-for="subsection in section.subsections" :key="subsection.number" class="mb-4">
            <h2 class="text-xl mb-2 text-gray-200">{{ section.number }}.{{ subsection.number }} {{ subsection.title }}</h2>
            <div v-if="subsection.content" class="mb-4 text-textLightGrey">
              <p>{{ subsection.content }}</p>
            </div>

            <ul v-if="subsection.points" class="list-disc list-outside pl-5 space-y-2 text-textLightGrey">
              <li v-for="(point, pointIndex) in subsection.points" :key="pointIndex">
                {{ point }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface PrivacySection {
  number: number
  title: string
  content?: string
  points?: string[]
  subsections?: PrivacySection[]
}

const sections = ref<PrivacySection[]>([
  {
    number: 1,
    title: 'INTRODUCTION',
    content:
      'WavsMarket ("we," "our," or "us") is committed to protecting and respecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website wavsmarket.com (the "Site"), create an account, and upload content. By using the Site, you consent to the data practices described in this policy.',
  },
  {
    number: 2,
    title: 'INFORMATION WE COLLECT',
    content: 'We collect the following categories of personal information to provide our services effectively:',
    subsections: [
      {
        number: 1,
        title: 'Personal Identification Information',
        points: [
          'Email Address: For account registration, notifications, and comments on your uploaded content.',
          'Password: Stored securely using encryption (hashed) for authentication purposes.',
          'Username: Publicly displayed on your profile as your user identifier.',
        ],
      },
      {
        number: 2,
        title: 'Content Information',
        content:
          'Any music, beats, or other content that you upload to our platform. This will be reviewed and approved by our admin before it is visible to the public.',
        points: [
          'By uploading content, you confirm that you hold the necessary rights and permissions for its distribution and use on the platform.',
        ],
      },
    ],
  },
  {
    number: 3,
    title: 'PURPOSE OF DATA COLLECTION',
    content: 'We collect personal data for the following purposes:',
    points: [
      'Account Creation and Management: To allow you to create, manage, and secure your account.',
      'Notifications: To notify you when someone interacts with your uploaded content, such as leaving comments.',
      'Content Display and Distribution: To verify and display your content, based on the terms you select for its distribution.',
      'Communication: To allow communication between users, such as messages about licensing, purchases, or other inquiries related to your content.',
    ],
  },
  {
    number: 4,
    title: 'USER-UPLOADED CONTENT',
    content:
      'When uploading content to our platform, you will be required to select the distribution terms under which your music is made available. If a user wants to purchase your content for commercial use or any other purpose not covered under the selected distribution terms, they must contact you directly through the available communication channels (e.g., direct message, email). The available options are:',
    points: [
      'Free to Use: Users may use your content without any charge or restrictions.',
      'Free for Non-Commercial Use: Users can use your content for free, but exclusively for non-commercial purposes.',
      'One-Time Payment: Users may pay a one-time fee to obtain a non-exclusive license for the use of your content.',
      'Exclusive Licensing: You may offer your content under an exclusive license, granting user exclusive rights for a specified period or use, as agreed upon between you and the user.',
    ],
  },
  {
    number: 5,
    title: 'DATA SECURITY',
    content:
      'We take the protection of your data seriously and implement industry-standard measures to safeguard it. While we take reasonable precautions to protect your data, no system is completely secure. We cannot guarantee the security of your personal information transmitted via our platform. These include:',
    points: [
      'Encryption: Your password is encrypted using secure hashing algorithms.',
      'Access Controls: Only authorized personnel have access to your personal data, and it is only used for the purposes specified in this Privacy Policy.',
      'Secure Storage: Personal data is stored in secure databases that are regularly monitored for potential vulnerabilities.',
      'Data Anonymization: Where appropriate, we may anonymize or pseudonymize your personal data to further reduce the risk of exposure in case of a security breach.',
    ],
  },
  {
    number: 6,
    title: 'SHARING OF DATA',
    content:
      'We do not sell, rent, or share your personal data with third parties except as necessary to provide the services or when required by law. We may share your data in the following cases:',
    points: [
      'Service Providers: We may share your data with trusted third-party service providers who assist in the operation of our platform. These service providers are contractually obligated to keep your data secure and use it solely for the purposes of providing services to us.',
      'Legal Compliance: We may disclose your information if required to do so by law or in response to valid requests by public authorities (e.g., a court or government agency).',
      'Business Transfers: In the event of a merger, acquisition, or sale of all or a portion of our assets, your personal data may be transferred as part of the transaction. We will notify you if your data becomes subject to a different privacy policy.',
    ],
  },
  {
    number: 7,
    title: 'YOUR RIGHTS AND CHOICES',
    content:
      'You have the following rights regarding your personal data: (To exercise any of these rights, please contact us at szymonjarosz102@gmail.com.)',
    points: [
      'Access: You can request access to the personal data we hold about you.',
      'Correction: You can request corrections to any inaccurate or incomplete data.',
      'Deletion: You may request the deletion of your account and personal data, subject to certain legal or contractual obligations.',
      'Opt-Out: You can opt-out of receiving marketing emails or notifications at any time by following the unsubscribe instructions in the emails or by managing your notification settings in your account.',
      'Data Portability: You have the right to request a copy of your personal data in a structured, commonly used, and machine-readable format, and to transfer it to another service provider.',
      'Restriction of Processing: You may request the restriction of processing of your personal data under certain circumstances, such as when you contest the accuracy of the data or when the processing is unlawful.',
    ],
  },
  {
    number: 8,
    title: 'THIRD-PARTY SERVICES',
    points: [
      'Third-Party Integration: We may use third-party services (e.g., hosting, analytics) to support our platform.',
      'Data Access: These third-party providers may access your data but are restricted to using it only for their designated services.',
      'Privacy Practices: We are not responsible for the privacy practices of third-party services. Please review their privacy policies for more information.',
    ],
  },
  {
    number: 9,
    title: 'INTERNATIONAL DATA TRANSFERS',
    points: [
      'Global Accessibility: As our platform is accessible worldwide, your personal information may be transferred to and stored in countries outside of your jurisdiction, including those that may not have data protection laws equivalent to those in your home country.',
      'Consent to Data Transfer: By using the Site, you consent to the transfer and processing of your personal data in locations where our servers and third-party service providers are based.',
    ],
  },
  {
    number: 10,
    title: "CHILDREN'S PRIVACY",
    points: [
      'Age Restriction: Our platform is not intended for individuals under the age of 13, and we do not knowingly collect personal data from children under 13.',
      'Unintentional Data Collection: If we become aware that we have inadvertently collected personal data from a child under 13, we will take immediate steps to delete such information.',
      "Action on Discovery: We are committed to protecting children's privacy and will act swiftly if we learn that any personal data has been collected from individuals under the age of 13.",
    ],
  },
  {
    number: 11,
    title: 'COOKIES AND TRACKING TECHNOLOGIES',
    points: [
      'Purpose of Cookies: We may use cookies and similar tracking technologies to enhance your experience on our platform and help us analyze how users interact with it.',
      'Improvement of Services: The information collected through cookies allows us to improve the services we provide and customize your experience.',
      'Cookie Control: You can control the use of cookies by adjusting your browser settings. However, disabling cookies may affect some features of the platform.',
    ],
  },
  {
    number: 12,
    title: 'CHANGES TO THIS PRIVACY POLICY',
    points: [
      'Periodic Updates: We may update this Privacy Policy periodically to reflect changes in our practices, services, or legal obligations. Any updates will be posted on this page.',
      'Review of Updates: The "Effective Date" at the top of this Privacy Policy will be revised accordingly, and we encourage you to review this Privacy Policy regularly for any updates.',
    ],
  },
  {
    number: 13,
    title: 'DATA RETENTION',
    points: [
      'Retention Period: We will retain your personal data for as long as your account is active or as needed to provide you with services, comply with legal obligations, resolve disputes, and enforce our agreements.',
      'Account Deletion: When your account is deleted, we will remove your personal data from our system, except where retention is necessary for legal or business purposes. In such cases, your data will be securely archived and inaccessible.',
      'Retention for Legal or Business Purposes: However, retention may be necessary for legal or business purposes, in which case we will keep your data as required by applicable laws or regulations.',
    ],
  },
  {
    number: 14,
    title: 'GOVERNING LAW AND DISPUTE RESOLUTION',
    content:
      'Governing Law: This Privacy Policy and your use of the Site shall be governed by and construed in accordance with the laws of Poland, without regard to its conflict of law principles.',
  },
  {
    number: 15,
    title: 'CONTACT US',
    content: 'If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:',
    points: ['Email: szymonjarosz102@gmail.com'],
  },
])
</script>
