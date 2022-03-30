import type { InferGetStaticPropsType } from 'next'
// TODO remove eslint-disable when fixed https://github.com/import-js/eslint-plugin-import/issues/1810
// eslint-disable-next-line import/no-unresolved
import { useLiveReload, useMDXComponent } from 'next-contentlayer/hooks'
import type { FC } from 'react'
import { allDocs, Doc } from 'contentlayer/generated'
import { Container } from '../../components/Container'
import { defineStaticProps, toParams } from '../../utils/next'
import { DocsNavigation } from 'src/components/DocsNavigation'
import { Callout } from '../../components/Callout'
import { DocsCard as Card } from '../../components/DocsCard'
import Link from 'next/link'
import Image from 'next/image'
import { DocsHeader } from '../../components/DocsHeader'
import { ChevronLink } from '../../components/ChevronLink'
import { Label } from '../../components/Label'
import { DocsFooter } from '../../components/DocsFooter'
import { getNodeText, sluggifyTitle } from '../../utils/sluggify'
import { PageNavigation } from 'src/components/PageNavigation'

export const getStaticPaths = async () => {
  const paths = allDocs.map((_) => _.pathSegments.map((_: PathSegment) => _.pathName).join('/')).map(toParams)
  return { paths, fallback: 'blocking' }
}

export const getStaticProps = defineStaticProps(async (context) => {
  const params = context.params as any
  const pagePath = params.slug?.join('/') ?? ''
  const doc = allDocs.find((_) => _.pathSegments.map((_: PathSegment) => _.pathName).join('/') === pagePath)!
  let slugs = params.slug ? ['', ...params.slug] : []
  let path = ''
  let breadcrumbs: any = []
  for (const slug of slugs) {
    path += path == '' ? slug : '/' + slug
    const navTitle = allDocs.find(
      (_) => _.pathSegments.map((_: PathSegment) => _.pathName).join('/') === path,
    )?.nav_title
    const title = allDocs.find((_) => _.pathSegments.map((_: PathSegment) => _.pathName).join('/') === path)?.title
    breadcrumbs.push({ path: '/docs/' + path, slug, title: navTitle || title })
  }
  const tree = buildTree(allDocs)
  const childrenTree = buildTree(
    allDocs,
    doc.pathSegments.map((_: PathSegment) => _.pathName),
  )

  return { props: { doc, tree, breadcrumbs, childrenTree } }
})

const H2: React.FC = ({ children }) => {
  const slug = sluggifyTitle(getNodeText(children))
  return (
    <h2 id={slug} onClick={() => (window.location.hash = `#${slug}`)} className="group relative cursor-pointer">
      <span className="absolute top-0 -left-6 hidden text-slate-400 group-hover:inline dark:text-slate-600">#</span>
      {children}
    </h2>
  )
}

const H3: React.FC = ({ children }) => {
  const slug = sluggifyTitle(getNodeText(children))
  return (
    <h3 id={slug} onClick={() => (window.location.hash = `#${slug}`)} className="group relative cursor-pointer">
      <span className="absolute top-0 -left-6 hidden text-slate-400 group-hover:inline dark:text-slate-600">#</span>
      {children}
    </h3>
  )
}

const H4: React.FC = ({ children }) => {
  const slug = sluggifyTitle(getNodeText(children))
  return (
    <h4 id={slug} onClick={() => (window.location.hash = `#${slug}`)} className="group relative cursor-pointer">
      <span className="absolute top-0 -left-6 hidden text-slate-400 group-hover:inline dark:text-slate-600">#</span>
      {children}
    </h4>
  )
}

const mdxComponents = { Callout, Card, Image, Link, ChevronLink, Label, h2: H2, h3: H3, h4: H4 }

const Page: FC<InferGetStaticPropsType<typeof getStaticProps>> = ({ doc, tree, breadcrumbs, childrenTree }) => {
  useLiveReload()
  const MDXContent = useMDXComponent(doc.body.code || '')

  return (
    <Container title={doc.title + ' – Contentlayer'} description={doc.excerpt}>
      <div className="relative mx-auto max-w-screen-2xl lg:flex">
        <div
          style={{ height: 'calc(100vh - 64px)' }}
          className="sticky top-16 hidden shrink-0 border-r border-gray-200 dark:border-gray-800 lg:block"
        >
          <div className="-ml-3 h-full overflow-y-scroll p-8 pl-16">
            <DocsNavigation tree={tree} />
          </div>
          <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-t from-white/0 to-white/100 dark:from-gray-950/0 dark:to-gray-950/100" />
          <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-b from-white/0 to-white/100 dark:from-gray-950/0 dark:to-gray-950/100" />
        </div>

        <div className="mx-auto w-full max-w-3xl">
          <DocsHeader tree={tree} breadcrumbs={breadcrumbs} title={doc.title} />
          <div className="p-4 py-8 md:px-8 lg:px-16">
            <div
              className="prose prose-slate prose-violet mb-4 w-full max-w-full 
            prose-headings:font-semibold prose-p:text-slate-500 prose-a:font-normal
            prose-code:font-normal prose-code:before:content-none prose-code:after:content-none
            prose-ul:text-slate-500 prose-hr:border-gray-200 dark:prose-invert dark:prose-p:text-slate-400
            dark:prose-ul:text-slate-400 dark:prose-hr:border-gray-800 md:mb-8"
            >
              {MDXContent && <MDXContent components={mdxComponents} />}
              {doc.show_child_cards && (
                <>
                  <hr />
                  <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
                    {childrenTree.map((card, index) => (
                      <Card
                        key={index}
                        title={card.title}
                        label={card.label}
                        subtitle={card.excerpt}
                        link={{ url: card.urlPath, label: 'See ' + card.nav_title }}
                      />
                    ))}
                  </div>
                </>
              )}
              <DocsFooter doc={doc} />
            </div>
          </div>
        </div>

        <div style={{ height: 'calc(100vh - 64px)' }} className="sticky top-16 hidden 1.5xl:block">
          <div className="h-full w-80 overflow-y-scroll p-8 pr-16">
            <PageNavigation headings={doc.headings} />
          </div>
          <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-t from-white/0 to-white/100 dark:from-gray-950/0 dark:to-gray-950/100" />
          <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-b from-white/0 to-white/100 dark:from-gray-950/0 dark:to-gray-950/100" />
        </div>
      </div>
    </Container>
  )
}

export default Page

export type TreeRoot = TreeNode[]

export type TreeNode = {
  title: string
  nav_title: string | null
  label: string | null
  excerpt: string | null
  urlPath: string
  children: TreeNode[]
}

type PathSegment = { order: number; pathName: string }

const buildTree = (docs: Doc[], parentPathNames: string[] = []): TreeNode[] => {
  const level = parentPathNames.length

  return docs
    .filter(
      (_) =>
        _.pathSegments.length === level + 1 &&
        _.pathSegments
          .map((_: PathSegment) => _.pathName)
          .join('/')
          .startsWith(parentPathNames.join('/')),
    )
    .sort((a, b) => a.pathSegments[level].order - b.pathSegments[level].order)
    .map<TreeNode>((doc) => ({
      nav_title: doc.nav_title ?? null,
      title: doc.title,
      label: doc.label ?? null,
      excerpt: doc.excerpt ?? null,
      urlPath: '/docs/' + doc.pathSegments.map((_: PathSegment) => _.pathName).join('/'),
      children: buildTree(
        docs,
        doc.pathSegments.map((_: PathSegment) => _.pathName),
      ),
    }))
}
