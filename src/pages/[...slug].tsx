import type { InferGetStaticPropsType } from 'next'
import type { FC } from 'react'
import { allPages } from 'contentlayer/generated'

import { PageLayout } from '../layouts/PageLayout'
import { defineStaticProps, toParams } from '../utils/next'
import { useLiveReload } from 'next-contentlayer/hooks'

export const getStaticPaths = async () => {
  const paths = allPages.map((_) => _.url_path).map(toParams)

  return { paths, fallback: false }
}

export const getStaticProps = defineStaticProps(async (context) => {
  const params = context.params as any
  const pagePath = params.slug?.join('/') ?? ''

  const doc = allPages.find((_) => _.url_path === pagePath)!

  return { props: { doc } }
})

const Page: FC<InferGetStaticPropsType<typeof getStaticProps>> = ({ doc }) => {
  useLiveReload()

  return <PageLayout page={doc} />
}

export default Page