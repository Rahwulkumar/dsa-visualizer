import React from 'react';
import { motion } from 'framer-motion';
import { 
  Hash, 
  Clock, 
  Database, 
  Zap, 
  Search, 
  Plus, 
  Trash2,
  TrendingUp,
  Shield,
  Layers
} from 'lucide-react';

const HashTableInfoPage = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <motion.section 
        className="py-20 px-6"
        initial="initial"
        animate="animate"
        variants={staggerChildren}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            variants={fadeInUp}
            className="mb-8"
          >
            <Hash className="w-20 h-20 text-blue-600 mx-auto mb-6" />
            <h1 className="text-5xl font-bold text-gray-800 mb-4">
              Hash Tables
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Efficient key-value data structures that provide constant-time average performance 
              for insertions, deletions, and lookups using hash functions.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Key Concepts */}
      <motion.section 
        className="py-16 px-6"
        variants={staggerChildren}
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            variants={fadeInUp}
            className="text-3xl font-bold text-gray-800 text-center mb-12"
          >
            Key Concepts
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              variants={fadeInUp}
              className="bg-white p-6 rounded-lg shadow-lg"
            >
              <Zap className="w-12 h-12 text-yellow-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Hash Function
              </h3>
              <p className="text-gray-600">
                A mathematical function that converts keys into array indices. 
                Good hash functions distribute keys uniformly across the table.
              </p>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="bg-white p-6 rounded-lg shadow-lg"
            >
              <Layers className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Collision Handling
              </h3>
              <p className="text-gray-600">
                When multiple keys hash to the same index, collision resolution 
                methods like chaining or open addressing handle the conflicts.
              </p>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="bg-white p-6 rounded-lg shadow-lg"
            >
              <TrendingUp className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Load Factor
              </h3>
              <p className="text-gray-600">
                The ratio of the number of stored entries to the table size. 
                Maintaining a low load factor ensures good performance.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* How It Works */}
      <motion.section 
        className="py-16 px-6 bg-white"
        variants={staggerChildren}
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            variants={fadeInUp}
            className="text-3xl font-bold text-gray-800 text-center mb-12"
          >
            How Hash Tables Work
          </motion.h2>
          
          <div className="space-y-12">
            {/* Step 1 */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-col lg:flex-row items-center gap-8"
            >
              <div className="lg:w-1/2">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-blue-800 mb-4 flex items-center gap-2">
                    <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">1</span>
                    Hash Function Calculation
                  </h3>
                  <p className="text-blue-700">
                    When inserting or searching for a key, the hash function converts 
                    the key into a numerical value, then applies modulo operation with 
                    the table size to get an array index.
                  </p>
                </div>
              </div>
              <div className="lg:w-1/2">
                <div className="bg-gray-100 p-4 rounded-lg font-mono text-sm">
                  <div className="text-gray-600">// Example hash function</div>
                  <div><span className="text-purple-600">function</span> <span className="text-blue-600">hash</span>(key) {'{'}
                  </div>
                  <div className="ml-4">
                    <span className="text-purple-600">let</span> hashValue = <span className="text-green-600">0</span>;
                  </div>
                  <div className="ml-4">
                    <span className="text-purple-600">for</span> (<span className="text-purple-600">let</span> i = <span className="text-green-600">0</span>; i &lt; key.length; i++) {'{'}
                  </div>
                  <div className="ml-8">
                    hashValue += key.charCodeAt(i);
                  </div>
                  <div className="ml-4">{'}'}</div>
                  <div className="ml-4">
                    <span className="text-purple-600">return</span> hashValue % tableSize;
                  </div>
                  <div>{'}'}</div>
                </div>
              </div>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-col lg:flex-row-reverse items-center gap-8"
            >
              <div className="lg:w-1/2">
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-green-800 mb-4 flex items-center gap-2">
                    <span className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">2</span>
                    Collision Resolution
                  </h3>
                  <p className="text-green-700">
                    When multiple keys hash to the same index (collision), 
                    chaining stores multiple entries in a linked list at that 
                    index, while open addressing finds alternative locations.
                  </p>
                </div>
              </div>
              <div className="lg:w-1/2">
                <div className="bg-gray-100 p-4 rounded-lg">
                  <div className="text-center text-sm text-gray-600 mb-2">Collision Handling with Chaining</div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-200 rounded flex items-center justify-center text-xs">0</div>
                      <div className="text-gray-400">→</div>
                      <div className="text-gray-400">NULL</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-200 rounded flex items-center justify-center text-xs">1</div>
                      <div className="text-gray-400">→</div>
                      <div className="bg-white border rounded px-2 py-1 text-xs">key1:val1</div>
                      <div className="text-gray-400">→</div>
                      <div className="bg-white border rounded px-2 py-1 text-xs">key2:val2</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-200 rounded flex items-center justify-center text-xs">2</div>
                      <div className="text-gray-400">→</div>
                      <div className="bg-white border rounded px-2 py-1 text-xs">key3:val3</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Step 3 */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-col lg:flex-row items-center gap-8"
            >
              <div className="lg:w-1/2">
                <div className="bg-purple-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-purple-800 mb-4 flex items-center gap-2">
                    <span className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">3</span>
                    Dynamic Resizing
                  </h3>
                  <p className="text-purple-700">
                    When the load factor becomes too high, the hash table 
                    automatically resizes (usually doubles) and rehashes all 
                    existing entries to maintain performance.
                  </p>
                </div>
              </div>
              <div className="lg:w-1/2">
                <div className="space-y-3">
                  <div className="text-center text-sm text-gray-600">Load Factor Impact</div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="text-center">
                      <div className="bg-green-100 border border-green-300 rounded p-2">
                        <div className="font-bold text-green-800">Good</div>
                        <div className="text-green-600">&lt; 0.75</div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="bg-yellow-100 border border-yellow-300 rounded p-2">
                        <div className="font-bold text-yellow-800">Fair</div>
                        <div className="text-yellow-600">0.75 - 1.0</div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="bg-red-100 border border-red-300 rounded p-2">
                        <div className="font-bold text-red-800">Poor</div>
                        <div className="text-red-600">&gt; 1.0</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Operations */}
      <motion.section 
        className="py-16 px-6"
        variants={staggerChildren}
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            variants={fadeInUp}
            className="text-3xl font-bold text-gray-800 text-center mb-12"
          >
            Core Operations
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              variants={fadeInUp}
              className="bg-white p-6 rounded-lg shadow-lg"
            >
              <Plus className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Insert
              </h3>
              <p className="text-gray-600 mb-4">
                Add a key-value pair to the hash table. If the key already exists, 
                update its value.
              </p>
              <div className="bg-gray-50 p-3 rounded text-sm">
                <div className="font-mono">
                  <span className="text-blue-600">Time:</span> O(1) average<br/>
                  <span className="text-blue-600">Space:</span> O(1)
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="bg-white p-6 rounded-lg shadow-lg"
            >
              <Search className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Search
              </h3>
              <p className="text-gray-600 mb-4">
                Find the value associated with a given key. Returns null if 
                the key doesn't exist.
              </p>
              <div className="bg-gray-50 p-3 rounded text-sm">
                <div className="font-mono">
                  <span className="text-blue-600">Time:</span> O(1) average<br/>
                  <span className="text-blue-600">Space:</span> O(1)
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="bg-white p-6 rounded-lg shadow-lg"
            >
              <Trash2 className="w-12 h-12 text-red-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Delete
              </h3>
              <p className="text-gray-600 mb-4">
                Remove a key-value pair from the hash table. Handle chain 
                cleanup if using collision resolution.
              </p>
              <div className="bg-gray-50 p-3 rounded text-sm">
                <div className="font-mono">
                  <span className="text-blue-600">Time:</span> O(1) average<br/>
                  <span className="text-blue-600">Space:</span> O(1)
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Time Complexity */}
      <motion.section 
        className="py-16 px-6 bg-gray-50"
        variants={staggerChildren}
      >
        <div className="max-w-4xl mx-auto">
          <motion.h2 
            variants={fadeInUp}
            className="text-3xl font-bold text-gray-800 text-center mb-12"
          >
            Performance Analysis
          </motion.h2>
          
          <motion.div
            variants={fadeInUp}
            className="bg-white rounded-lg shadow-lg overflow-hidden"
          >
            <div className="px-6 py-4 bg-blue-600 text-white">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Clock className="w-6 h-6" />
                Time & Space Complexity
              </h3>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b">
                      <th className="py-3 px-4 font-semibold text-gray-800">Operation</th>
                      <th className="py-3 px-4 font-semibold text-gray-800">Average Case</th>
                      <th className="py-3 px-4 font-semibold text-gray-800">Worst Case</th>
                      <th className="py-3 px-4 font-semibold text-gray-800">Space</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-3 px-4 font-medium">Search</td>
                      <td className="py-3 px-4 font-mono text-green-600">O(1)</td>
                      <td className="py-3 px-4 font-mono text-red-600">O(n)</td>
                      <td className="py-3 px-4 font-mono text-blue-600">O(n)</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4 font-medium">Insert</td>
                      <td className="py-3 px-4 font-mono text-green-600">O(1)</td>
                      <td className="py-3 px-4 font-mono text-red-600">O(n)</td>
                      <td className="py-3 px-4 font-mono text-blue-600">O(n)</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium">Delete</td>
                      <td className="py-3 px-4 font-mono text-green-600">O(1)</td>
                      <td className="py-3 px-4 font-mono text-red-600">O(n)</td>
                      <td className="py-3 px-4 font-mono text-blue-600">O(1)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> Worst case occurs when all keys hash to the same index, 
                  creating a long chain. Good hash functions and appropriate load factors 
                  minimize this scenario.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Applications */}
      <motion.section 
        className="py-16 px-6"
        variants={staggerChildren}
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            variants={fadeInUp}
            className="text-3xl font-bold text-gray-800 text-center mb-12"
          >
            Real-world Applications
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              variants={fadeInUp}
              className="bg-white p-6 rounded-lg shadow-lg"
            >
              <Database className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Database Indexing
              </h3>
              <p className="text-gray-600">
                Hash tables are used for creating indexes in databases, enabling 
                fast lookups and joins based on key values.
              </p>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="bg-white p-6 rounded-lg shadow-lg"
            >
              <Shield className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Caching Systems
              </h3>
              <p className="text-gray-600">
                Web servers and applications use hash tables for caching frequently 
                accessed data to improve performance.
              </p>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="bg-white p-6 rounded-lg shadow-lg"
            >
              <Search className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Symbol Tables
              </h3>
              <p className="text-gray-600">
                Compilers use hash tables to store variable names, function names, 
                and other symbols during compilation.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Best Practices */}
      <motion.section 
        className="py-16 px-6 bg-blue-50"
        variants={staggerChildren}
      >
        <div className="max-w-4xl mx-auto">
          <motion.h2 
            variants={fadeInUp}
            className="text-3xl font-bold text-gray-800 text-center mb-12"
          >
            Best Practices
          </motion.h2>
          
          <motion.div
            variants={fadeInUp}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-green-800 mb-4">
                ✅ Do's
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  Choose a good hash function that distributes keys evenly
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  Keep load factor below 0.75 for optimal performance
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  Use prime numbers for table sizes when possible
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  Consider dynamic resizing as data grows
                </li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-red-800 mb-4">
                ❌ Don'ts
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">•</span>
                  Don't use simple hash functions that create clustering
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">•</span>
                  Don't ignore load factor - it affects performance significantly
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">•</span>
                  Don't use hash tables for ordered data requirements
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">•</span>
                  Don't forget to handle collision cases properly
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default HashTableInfoPage;
