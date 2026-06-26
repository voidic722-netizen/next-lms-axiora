import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const url = searchParams.get('url')
  const fileName = searchParams.get('fileName')

  if (!url) {
    return new NextResponse('Missing url parameter', { status: 400 })
  }

  try {
    const res = await fetch(url)
    
    if (!res.ok) {
      return new NextResponse(`Failed to fetch file: ${res.statusText}`, { status: res.status })
    }

    const headers = new Headers(res.headers)
    if (fileName) {
      headers.set('Content-Disposition', `attachment; filename="${fileName}"`)
    }

    return new NextResponse(res.body, {
      status: 200,
      headers,
    })
  } catch (error: any) {
    return new NextResponse(`Error downloading file: ${error.message}`, { status: 500 })
  }
}
