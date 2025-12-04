import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { ItemResult } from '../types';
import { mockApi } from '../services/mockApi';

export const useInspections = () => {
  return useQuery({
    queryKey: ['inspections'],
    // ВАЖНО: вызывать метод через обёртку, иначе теряется контекст this и возникает ошибка
    queryFn: () => mockApi.getInspections(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useInspection = (id: string) => {
  return useQuery({
    queryKey: ['inspection', id],
    queryFn: () => mockApi.getInspection(id),
    enabled: !!id,
  });
};

export const useChecklistTemplate = (templateId: string) => {
  return useQuery({
    queryKey: ['checklistTemplate', templateId],
    queryFn: () => mockApi.getChecklistTemplate(templateId),
    enabled: !!templateId,
  });
};

export const useCreateInspection = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: { storeId: string; templateId: string }) =>
      mockApi.createInspection(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inspections'] });
    },
  });
};

export const useUpdateInspectionItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ 
      inspectionId, 
      itemId, 
      updates 
    }: { 
      inspectionId: string; 
      itemId: string; 
      updates: Partial<ItemResult> 
    }) =>
      mockApi.updateInspectionItem(inspectionId, itemId, updates),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ['inspection', variables.inspectionId] 
      });
      queryClient.invalidateQueries({ queryKey: ['inspections'] });
    },
  });
};

export const useCompleteInspection = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ 
      inspectionId, 
      signature 
    }: { 
      inspectionId: string; 
      signature: string 
    }) =>
      mockApi.completeInspection(inspectionId, signature),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ['inspection', variables.inspectionId] 
      });
      queryClient.invalidateQueries({ queryKey: ['inspections'] });
    },
  });
};
