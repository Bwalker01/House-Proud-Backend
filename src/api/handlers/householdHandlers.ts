import { FastifyReply, FastifyRequest } from 'fastify';
import { firestore } from '../../config/firebase';
import { ApiError } from '../apiError';
import { ResponseHandler } from '../utils/responseHandler';
import { v4 as uuidv4 } from 'uuid';
import { generateInviteCode } from '../utils/inviteCodeGenerator';

export const getHousehold = async (
  req: FastifyRequest<{
    Querystring: {
      id: string;
    };
  }>,
  res: FastifyReply,
) => {
  const { id } = req.query;
  const householdRef = firestore.collection('households').doc(id);
  const householdDoc = await householdRef.get();

  if (!householdDoc.exists) {
    throw ApiError.notFound('Household not found');
  }

  const householdData = householdDoc.data();
  const household = {
    id: householdDoc.id,
    ...householdData,
  };

  return ResponseHandler.success(res, {
    status: 200,
    data: household,
  });
};

export const createHousehold = async (
  req: FastifyRequest<{
    Body: {
      name: string;
    };
  }>,
  res: FastifyReply,
) => {
  const { name } = req.body;

  if (!name || typeof name !== 'string') {
    throw ApiError.badRequest(
      'Household name is required and must be a string',
    );
  }

  const householdId = uuidv4();
  const householdRef = firestore.collection('households').doc(householdId);
  const householdData = {
    id: householdId,
    name,
    created: new Date().toISOString(),
    memberIds: [],
    inviteCode: generateInviteCode(),
    quoteSettings: {
      mode: 'random',
      quote: null,
    },
  };

  await householdRef.set(householdData);

  return ResponseHandler.success(res, {
    status: 201,
    data: householdData,
    message: 'Household created successfully.',
  });
};
