import type { InspectionInstance, ChecklistTemplate, ItemResult, Store, Photo } from '../types';
import { mockData } from '../data/mockData';

// Simulate network delay
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

class MockApiService {
  private inspections: InspectionInstance[] = [];
  private templates: ChecklistTemplate[] = [];
  private stores: Store[] = [];

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    this.templates = mockData.checklistTemplates;
    this.stores = mockData.stores;
    this.inspections = mockData.inspections;
    console.log('MockAPI: Initialized with', {
      templates: this.templates.length,
      stores: this.stores.length,
      inspections: this.inspections.length
    });
  }

  async getInspections(): Promise<InspectionInstance[]> {
    await delay();
    console.log('MockAPI: getInspections called, returning:', this.inspections.length, 'inspections');
    return [...this.inspections];
  }

  async getInspection(id: string): Promise<InspectionInstance> {
    await delay();
    
    const inspection = this.inspections.find(i => i.id === id);
    if (!inspection) {
      // Create new inspection if not found (for new inspections)
      if (id.startsWith('new-')) {
        const newInspection = this.createNewInspection();
        this.inspections.push(newInspection);
        return newInspection;
      }
      throw new Error(`Inspection with id ${id} not found`);
    }
    
    return { ...inspection };
  }

  async getChecklistTemplate(templateId: string): Promise<ChecklistTemplate> {
    await delay();
    
    const template = this.templates.find(t => t.id === templateId);
    if (!template) {
      throw new Error(`Template with id ${templateId} not found`);
    }
    
    return { ...template };
  }

  async getStores(): Promise<Store[]> {
    await delay();
    return [...this.stores];
  }

  async createInspection(data: { storeId: string; templateId: string }): Promise<InspectionInstance> {
    await delay();
    
    const template = this.templates.find(t => t.id === data.templateId);
    if (!template) {
      throw new Error('Template not found');
    }

    const newInspection: InspectionInstance = {
      id: `inspection-${Date.now()}`,
      templateId: data.templateId,
      storeId: data.storeId,
      curatorId: '1', // Current user
      date: new Date().toISOString(),
      startTime: new Date().toISOString(),
      endTime: null,
      items: template.items.map(item => ({
        itemId: item.id,
        score: null,
        comments: '',
        photos: [],
        isCompleted: false,
        notified: false,
      })),
      totalScore: 0,
      averageScore: 0,
      status: 'in_progress',
      syncStatus: 'offline',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.inspections.push(newInspection);
    return newInspection;
  }

  async updateInspectionItem(
    inspectionId: string, 
    itemId: string, 
    updates: Partial<ItemResult>
  ): Promise<InspectionInstance> {
    await delay(200);
    
    const inspection = this.inspections.find(i => i.id === inspectionId);
    if (!inspection) {
      throw new Error('Inspection not found');
    }

    const itemIndex = inspection.items.findIndex(item => item.itemId === itemId);
    if (itemIndex === -1) {
      throw new Error('Item not found');
    }

    // Update item
    inspection.items[itemIndex] = {
      ...inspection.items[itemIndex],
      ...updates,
    };

    // Recalculate scores
    this.recalculateScores(inspection);
    
    // Update timestamps
    inspection.updatedAt = new Date().toISOString();
    inspection.syncStatus = 'pending';

    return { ...inspection };
  }

  async completeInspection(inspectionId: string, signature: string): Promise<InspectionInstance> {
    await delay();
    
    const inspection = this.inspections.find(i => i.id === inspectionId);
    if (!inspection) {
      throw new Error('Inspection not found');
    }

    inspection.status = 'completed';
    inspection.endTime = new Date().toISOString();
    inspection.signature = signature;
    inspection.updatedAt = new Date().toISOString();
    inspection.syncStatus = 'pending';

    return { ...inspection };
  }

  async uploadPhoto(file: File): Promise<Photo> {
    await delay(1000);
    
    // Simulate photo upload
    const photo: Photo = {
      id: `photo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      uri: URL.createObjectURL(file),
      type: 'general',
      timestamp: new Date().toISOString(),
      compressed: true,
      uploaded: true,
      size: file.size,
    };

    return photo;
  }

  private createNewInspection(): InspectionInstance {
    const template = this.templates[0]; // Use first template as default
    const store = this.stores[0]; // Use first store as default

    return {
      id: `inspection-${Date.now()}`,
      templateId: template.id,
      storeId: store.id,
      curatorId: '1',
      date: new Date().toISOString(),
      startTime: new Date().toISOString(),
      endTime: null,
      items: template.items.map(item => ({
        itemId: item.id,
        score: null,
        comments: '',
        photos: [],
        isCompleted: false,
        notified: false,
      })),
      totalScore: 0,
      averageScore: 0,
      status: 'in_progress',
      syncStatus: 'offline',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  private recalculateScores(inspection: InspectionInstance) {
    const scoredItems = inspection.items.filter(item => item.score !== null);
    const totalScore = scoredItems.reduce((sum, item) => sum + (item.score || 0), 0);
    const averageScore = scoredItems.length > 0 ? totalScore / scoredItems.length : 0;

    inspection.totalScore = totalScore;
    inspection.averageScore = averageScore;
  }
}

export const mockApi = new MockApiService();
