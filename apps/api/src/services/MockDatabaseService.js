const winston = require('winston');

class MockDatabaseService {
  constructor() {
    this.data = new Map();
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'database.log' }),
      ],
    });
  }

  async initialize() {
    try {
      // Initialize with sample data
      this.data.set('users', [
        {
          id: '1',
          email: 'admin@webduhvercel.com',
          username: 'admin',
          full_name: 'WebduhVercel Admin',
          created_at: new Date().toISOString(),
        },
      ]);

      this.data.set('teams', [
        {
          id: '1',
          name: 'WebduhVercel Team',
          slug: 'webduhvercel',
          description: 'The official WebduhVercel development team',
          plan: 'enterprise',
          created_at: new Date().toISOString(),
        },
      ]);

      this.data.set('projects', [
        {
          id: '1',
          name: 'Sample Project',
          slug: 'sample-project',
          description: 'A sample project for demonstration',
          framework: 'nextjs',
          team_id: '1',
          created_by: '1',
          status: 'active',
          created_at: new Date().toISOString(),
        },
      ]);

      this.data.set('deployments', []);
      this.data.set('analytics_events', []);

      this.logger.info('Mock database initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize mock database:', error);
      throw error;
    }
  }

  async query(text, params) {
    try {
      // Mock query execution - just log and return empty result
      this.logger.debug('Mock query executed', { query: text });
      return {
        rows: [],
        rowCount: 0,
      };
    } catch (error) {
      this.logger.error('Mock database query error:', {
        query: text,
        error: error.message,
      });
      throw error;
    }
  }

  async getClient() {
    return {
      query: this.query.bind(this),
      release: () => {},
    };
  }

  async isHealthy() {
    return true;
  }

  async close() {
    this.data.clear();
    this.logger.info('Mock database connection closed');
  }

  // Helper methods for common operations
  async findById(table, id) {
    const tableData = this.data.get(table) || [];
    return tableData.find((item) => item.id === id);
  }

  async findAll(table, conditions = {}) {
    const tableData = this.data.get(table) || [];

    if (Object.keys(conditions).length === 0) {
      return tableData;
    }

    return tableData.filter((item) => {
      return Object.entries(conditions).every(
        ([key, value]) => item[key] === value,
      );
    });
  }

  async create(table, data) {
    const tableData = this.data.get(table) || [];
    const newItem = {
      ...data,
      id: String(Date.now()),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    tableData.push(newItem);
    this.data.set(table, tableData);

    this.logger.info(`Created item in ${table}`, { id: newItem.id });
    return newItem;
  }

  async update(table, id, data) {
    const tableData = this.data.get(table) || [];
    const itemIndex = tableData.findIndex((item) => item.id === id);

    if (itemIndex === -1) {
      throw new Error(`Item with id ${id} not found in ${table}`);
    }

    const updatedItem = {
      ...tableData[itemIndex],
      ...data,
      updated_at: new Date().toISOString(),
    };

    tableData[itemIndex] = updatedItem;
    this.data.set(table, tableData);

    this.logger.info(`Updated item in ${table}`, { id });
    return updatedItem;
  }

  async delete(table, id) {
    const tableData = this.data.get(table) || [];
    const itemIndex = tableData.findIndex((item) => item.id === id);

    if (itemIndex === -1) {
      throw new Error(`Item with id ${id} not found in ${table}`);
    }

    const deletedItem = tableData[itemIndex];
    tableData.splice(itemIndex, 1);
    this.data.set(table, tableData);

    this.logger.info(`Deleted item from ${table}`, { id });
    return deletedItem;
  }

  // Statistics for development
  getStats() {
    const stats = {};
    for (const [table, data] of this.data.entries()) {
      stats[table] = data.length;
    }
    return stats;
  }
}

module.exports = MockDatabaseService;
