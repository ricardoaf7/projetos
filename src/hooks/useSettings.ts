import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface Agency {
  id: string;
  name: string;
}

export interface Sector {
  id: string;
  name: string;
}

export const useSettings = () => {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [agenciesRes, sectorsRes] = await Promise.all([
        supabase.from('agencies').select('*').order('name'),
        supabase.from('sectors').select('*').order('name')
      ]);

      if (agenciesRes.error) throw agenciesRes.error;
      if (sectorsRes.error) throw sectorsRes.error;

      setAgencies(agenciesRes.data || []);
      setSectors(sectorsRes.data || []);
    } catch (err: any) {
      console.error('Error fetching settings data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addAgency = async (name: string): Promise<boolean> => {
    try {
      const { error } = await supabase.from('agencies').insert([{ name }]);
      if (error) throw error;
      fetchData();
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  const deleteAgency = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase.from('agencies').delete().eq('id', id);
      if (error) throw error;
      fetchData();
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  const updateAgency = async (id: string, name: string): Promise<boolean> => {
    try {
      const { error } = await supabase.from('agencies').update({ name }).eq('id', id);
      if (error) throw error;
      fetchData();
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  const addSector = async (name: string): Promise<boolean> => {
    try {
      const { error } = await supabase.from('sectors').insert([{ name }]);
      if (error) throw error;
      fetchData();
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  const deleteSector = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase.from('sectors').delete().eq('id', id);
      if (error) throw error;
      fetchData();
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  const updateSector = async (id: string, name: string): Promise<boolean> => {
    try {
      const { error } = await supabase.from('sectors').update({ name }).eq('id', id);
      if (error) throw error;
      fetchData();
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  return {
    agencies,
    sectors,
    loading,
    error,
    addAgency,
    deleteAgency,
    updateAgency,
    addSector,
    deleteSector,
    updateSector,
    refresh: fetchData
  };
};
