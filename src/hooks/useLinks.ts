import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { linkService } from '../services/api';
import type { Link, CreateLinkRequest, LinkStats } from '../types';

export const useLinks = () => {
  return useQuery<Link[], Error>({
    queryKey: ['links'],
    queryFn: linkService.getAllLinks,
  });
};

export const useCreateLink = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateLinkRequest) => linkService.createLink(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links'] });
    },
  });
};

export const useDeleteLink = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (code: string) => linkService.deleteLink(code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links'] });
    },
  });
};

export const useLinkStats = (code: string) => {
  return useQuery<LinkStats, Error>({
    queryKey: ['linkStats', code],
    queryFn: () => linkService.getLinkStats(code),
    enabled: !!code,
  });
};