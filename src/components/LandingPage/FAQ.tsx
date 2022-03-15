import { useRouter } from 'next/router'
import { FC } from 'react'
import { Button } from '../Button'
import { IconName } from '../Icon'

const content = {
  heading: 'Frequently Asked Questions',
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Facilisi dolor justo, elementum a est sed. Netus justo, aliquet quis ac, est scelerisque.',
  elements: [
    {
      question: 'Can I incrementally adopt Contentlayer?',
      answer:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Facilisi dolor justo, elementum a est sed. Netus justo, aliquet quis ac, est scelerisque. Ridiculus in lacus, vel egestas risus nulla. Pretium amet, massa vitae lorem aliquam nisl, nullam mus donec.',
    },
    {
      question: 'Does Contentlayer scale?',
      answer:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Facilisi dolor justo, elementum a est sed. Netus justo, aliquet quis ac, est scelerisque. Ridiculus in lacus, vel egestas risus nulla. Pretium amet, massa vitae lorem aliquam nisl, nullam mus donec.',
    },
    {
      question: 'Will Contentlayer slow down my builds?',
      answer:
        'Quite the opposite. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Facilisi dolor justo, elementum a est sed. Netus justo, aliquet quis ac, est scelerisque. Ridiculus in lacus, vel egestas risus nulla. Pretium amet, massa vitae lorem aliquam nisl, nullam mus donec.',
    },
  ],
  primaryAction: { label: 'Read more in docs', url: '/' },
  secondaryAction: {
    label: 'Ask a question',
    url: '/docs/concepts/why-contentlayer',
    icon: 'external-link' as IconName,
  },
}

export const FAQ: FC = () => {
  const router = useRouter()

  return (
    <div className="bg-gray-50 mt-16 md:mt-0 dark:bg-gray-900/50">
      <div className="w-full max-w-screen-xl mx-auto px-4 md:px-8 py-16 md:py-24 lg:py-32 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="md:max-w-md">
          <h2 className="text-slate-800 font-semibold text-3xl dark:text-slate-200 mt-0">{content.heading}</h2>
          <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{content.description}</p>
          <div className="flex flex-col space-y-4 mt-8 sm:flex-row md:flex-col lg:flex-row sm:space-y-0 md:space-y-4 lg:space-y-0 sm:space-x-4 md:space-x-0 lg:space-x-4">
            <Button
              label={content.primaryAction.label}
              action={() => router.push(content.primaryAction.url)}
              theme="primary"
            />
            <Button
              label={content.secondaryAction.label}
              action={() => router.push(content.secondaryAction.url)}
              theme="secondary"
              icon={content.secondaryAction?.icon}
            />
          </div>
        </div>
        <ul className="list-none m-0 space-y-8">
          {content.elements.map(({ question, answer }, index) => (
            <li key={index}>
              <h3 className="m-0 text-xl font-semibold text-slate-800 dark:text-slate-200">{question}</h3>
              <p className="mt-4 text-slate-500 dark:text-slate-400 leading-relaxed">{answer}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
