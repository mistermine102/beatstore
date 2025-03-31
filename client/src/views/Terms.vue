<template>
  <div class="container mx-auto px-4 py-8 max-w-4xl">
    <h1 class="text-3xl font-bold text-center mb-6">Terms and Conditions</h1>

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
          <div v-for="subsection in section.subsections" class="mb-4">
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

interface TermsSection {
  number: number
  title: string
  content?: string
  points?: string[]
  subsections?: TermsSection[]
}

const sections = ref<TermsSection[]>([
  {
    number: 1,
    title: 'DEFINITIONS',
    content: 'For the purposes of these Terms and Conditions:',
    points: [
      '"Platform" refers to WavsMarket, the website and all services provided, including content hosting, user profiles, and browsing functionalities.',
      '"User" refers to any individual who creates an account and accesses the platform.',
      '"Uploader" refers to a user who uploads music, beats, or other content.',
      '"Content" refers to all music, beats, images, metadata, text, or other media uploaded by a user.',
      '"License Terms" refer to the conditions under which the Uploader distributes their content.',
      '"Admin" refers to platform administrators who review and approve uploaded content before it becomes publicly visible.',
    ],
  },
  {
    number: 2,
    title: 'ACCOUNT REGISTRATION AND USER RESPONSIBILITIES',
    subsections: [
      {
        number: 1,
        title: 'Eligibility',
        points: [
          'Users must be at least 18 years old or have permission from a legal guardian to use the platform.',
          'By registering, users confirm that they are legally able to enter into agreements under their jurisdiction’s laws.',
          'Accounts created using false, incomplete, or misleading information may be suspended or deleted.',
        ],
      },
      {
        number: 2,
        title: 'Registration Requirements',
        points: [
          'Users must provide a valid email address, unique username, and secure password to register.',
          'The email address will be used for account verification, notifications, and platform-related updates.',
          'Passwords are securely hashed and not visible to the platform administrators, ensuring enhanced security and protection against unauthorized access.',
        ],
      },
      {
        number: 3,
        title: 'Account Security',
        points: [
          'Users must keep their login credentials confidential and not share their accounts with others.',
          'If unauthorized access is suspected, users must notify szymonjarosz102@gmail.com immediately.',
          'The platform is not responsible for losses or damages resulting from compromised account security.',
        ],
      },
    ],
  },
  {
    number: 3,
    title: 'CONTENT UPLOAD, OWNERSHIP, AND LICENSING',
    subsections: [
      {
        number: 1,
        title: 'Ownership of Content',
        points: [
          'Uploaders retain full ownership of any content they submit. WavsMarket does not claim any rights over uploaded content.',
          'By uploading content, users grant WavsMarket a non-exclusive, worldwide, royalty-free license to store, display, and distribute content as per the selected License Terms.',
          'Uploaders acknowledge that they have the legal right to distribute the uploaded content and that it does not infringe on third-party rights.',
        ],
      },
      {
        number: 2,
        title: 'Licensing and Distribution',
        points: [
          'Completely Free to Use – The content is available for both personal and commercial use without restrictions.',
          'Free for Non-Commercial Use, with a One-Time Payment for Commercial Use – The content may be used for personal projects, but a one-time payment is required for commercial use (royalty-free).',
          'Users interested in purchasing content must contact the Uploader directly through DM, email, or another communication method chosen by the Uploader.',
          'WavsMarket does not facilitate or mediate any financial transactions between users.',
        ],
      },
      {
        number: 3,
        title: 'Content Approval & Moderation',
        points: [
          'All uploaded content must undergo an admin approval process before being visible on the platform.',
          'The platform reserves the right to reject, remove, or modify content that violates these Terms, contains explicit or illegal material, or is flagged for copyright infringement.',
          'If content is reported for violating third-party rights, it may be removed without prior notice, and the uploader may face account suspension.',
        ],
      },
    ],
  },
  {
    number: 4,
    title: 'USER CONDUCT AND RESTRICTIONS',
    content:
      'Users agree not to engage in the following activities (Violations may result in account suspension, permanent ban, and/or legal action):',
    points: [
      'Uploading content that they do not own or have the legal right to distribute.',
      'Infringing upon copyrights, trademarks, or intellectual property rights of others.',
      'Using the platform for illegal activities, including fraud, scams, or distribution of pirated content.',
      'Attempting to hack, modify, disrupt, or reverse-engineer any part of the platform.',
      'Harassing, abusing, or threatening other users through comments, messages, or other means.',
      'Uploading or sharing malicious software, spam, or misleading links.',
    ],
  },
  {
    number: 5,
    title: 'EMAIL NOTIFICATIONS',
    content: 'Email notifications will be sent in the following circumstances:',
    points: [
      'When a piece of music uploaded by a user gets verified by an admin',
      'When a piece of music uploaded by a user gets liked',
      'When a piece of music uploaded by a user gets commented on',
    ],
  },
  {
    number: 6,
    title: 'DATA COLLECTION AND PRIVACY',
    subsections: [
      {
        number: 1,
        title: 'Data We Collect',
        content: 'By using the platform, you consent to our collection of the following data:',
        points: [
          'Email Address: Used for account registration, notifications, and platform-related updates.',
          'Username: Displayed publicly on your profile and content uploads.',
          'Password: Stored securely in a hashed format and never shared with third parties.',
        ],
      },
      {
        number: 2,
        title: 'Data Protection & Security',
        points: [
          'We take reasonable measures to secure and protect user data from unauthorized access.',
          'Users are responsible for keeping their accounts secure and reporting any suspected breaches.',
          'More details can be found in our Privacy Policy.',
        ],
      },
    ],
  },
  {
    number: 7,
    title: 'LIMITATION OF LIABILITY',
    points: [
      'WavsMarket is a content-hosting platform and does not mediate agreements between users.',
      'We are not responsible for disputes, financial transactions, or licensing issues between users.',
      'Users assume full responsibility for how they distribute or use content obtained from the platform.',
      'The platform is provided "as is" without warranties, and we are not liable for any data loss, outages, or security breaches.',
    ],
  },
  {
    number: 8,
    title: 'TERMINATION AND CONTENT REMOVAL',
    subsections: [
      {
        number: 1,
        title: 'Account Termination',
        content: 'We reserve the right to suspend or terminate user accounts if they:',
        points: [
          'Violate these Terms and Conditions.',
          'Upload infringing, illegal, or harmful content.',
          'Engage in fraudulent or abusive behavior.',
        ],
      },
      {
        number: 2,
        title: 'Content Removal',
        content: 'Content may be removed if:',
        points: [
          'It is found to be violating intellectual property laws.',
          'It is reported for explicit, offensive, or harmful material.',
          'The Uploader deletes their account or requests removal.',
          'It is deemed to violate the platform’s community guidelines or terms of use.',
        ],
      },
    ],
  },
  {
    number: 9,
    title: 'INTELLECTUAL PROPERTY & DMCA POLICY',
    content:
      'If you believe your copyrighted work has been uploaded without permission, you may submit a DMCA takedown request to szymonjarosz102@gmail.com. We will investigate and remove infringing content as required by applicable copyright laws. Your request must include:',
    points: [
      'Identification of the copyrighted work.',
      'A statement that you own or represent the copyright holder.',
      'A good-faith belief statement that the content is unauthorized.',
    ],
  },
  {
    number: 10,
    title: 'CHANGES TO THESE TERMS',
    points: [
      'We reserve the right to modify these Terms at any time. Changes may be made to reflect updates in laws, platform features, or security measures.',
      "Users will be notified of significant changes via email or on the platform. It is the user's responsibility to review the updated Terms and stay informed about any modifications.",
      'Continued use of the platform after modifications means you accept the updated Terms. If you do not agree with the revised Terms, you must stop using the platform immediately.',
    ],
  },
  {
    number: 11,
    title: 'GOVERNING LAW & JURISDICTION',
    points: ['These Terms and Conditions shall be governed by the laws of Poland.'],
  },
  {
    number: 12,
    title: 'CONTACT INFORMATION',
    content: 'For any questions regarding these Terms, please contact us at:',
    points: ['Email: szymonjarosz102@gmail.com'],
  },
])
</script>
