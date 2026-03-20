import test from 'node:test'
import assert from 'node:assert/strict'
import { createChatHandler, healthHandler } from './app.js'

function createMockRes() {
  return {
    statusCode: 200,
    body: undefined,
    status(code) {
      this.statusCode = code
      return this
    },
    json(payload) {
      this.body = payload
      return this
    },
  }
}

test('healthHandler returns ok true', () => {
  const req = {}
  const res = createMockRes()

  healthHandler(req, res)

  assert.equal(res.statusCode, 200)
  assert.deepEqual(res.body, { ok: true })
})

test('chatHandler validates missing message', async () => {
  const openaiStub = {
    responses: {
      create: async () => ({ output_text: 'unused' }),
    },
  }
  const handler = createChatHandler(openaiStub)
  const req = { body: {} }
  const res = createMockRes()

  await handler(req, res)

  assert.equal(res.statusCode, 400)
  assert.deepEqual(res.body, {
    error: 'Missing "message" (string) in request body.',
  })
})

test('chatHandler returns model output', async () => {
  let capturedPayload
  const openaiStub = {
    responses: {
      create: async (payload) => {
        capturedPayload = payload
        return { output_text: 'Hello from test model' }
      },
    },
  }

  const handler = createChatHandler(openaiStub)
  const req = { body: { message: 'Who is Brian?' } }
  const res = createMockRes()

  await handler(req, res)

  assert.equal(res.statusCode, 200)
  assert.deepEqual(res.body, { reply: 'Hello from test model' })
  assert.equal(capturedPayload.model, 'gpt-4.1-mini')
  assert.equal(capturedPayload.input[1].content, 'Who is Brian?')
})

test('chatHandler returns 500 on OpenAI errors', async () => {
  const openaiStub = {
    responses: {
      create: async () => {
        throw new Error('API failure')
      },
    },
  }

  const handler = createChatHandler(openaiStub)
  const req = { body: { message: 'test' } }
  const res = createMockRes()

  await handler(req, res)

  assert.equal(res.statusCode, 500)
  assert.deepEqual(res.body, { error: 'API failure' })
})
