"use client";

import { useState, useEffect } from 'react';
import { generatePassphrase, generateAlphanumeric } from '../utils/passwordGenerator';
import { useTheme } from 'next-themes';

interface PasswordSettings {
  length: number;
  includeUppercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  type: 'passphrase' | 'alphanumeric';
}

export default function PasswordGenerator() {
  const [settings, setSettings] = useState<PasswordSettings>({
    length: 12,
    includeUppercase: true,
    includeNumbers: true,
    includeSymbols: false,
    type: 'alphanumeric'
  });
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  // After mounting, we have access to the theme
  useEffect(() => setMounted(true), []);

  const generatePassword = async () => {
    setLoading(true);
    try {
      switch (settings.type) {
        case 'passphrase':
          const passphrase = await generatePassphrase(
            Math.max(2, Math.floor(settings.length / 4)),
            settings.includeNumbers,
            settings.includeSymbols
          );
          setPassword(passphrase);
          break;
        case 'alphanumeric':
          setPassword(generateAlphanumeric(
            settings.length,
            settings.includeUppercase,
            settings.includeNumbers,
            settings.includeSymbols
          ));
          break;
      }
    } catch (error) {
      console.error('Error generating password:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generatePassword();
  }, [settings]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(password);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy password:', err);
    }
  };

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 relative">
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        title={resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {resolvedTheme === 'dark' ? '🌞' : '🌙'}
      </button>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
            Password Type
          </label>
          <select
            className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
            value={settings.type}
            onChange={(e) => setSettings({
              ...settings,
              type: e.target.value as PasswordSettings['type']
            })}
          >
            <option value="passphrase">Passphrase</option>
            <option value="alphanumeric">Alphanumeric</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
            {settings.type === 'passphrase' ? 'Words: ' + Math.max(2, Math.floor(settings.length / 4)) : 'Length: ' + settings.length}
          </label>
          <input
            type="range"
            min="8"
            max="32"
            value={settings.length}
            onChange={(e) => setSettings({
              ...settings,
              length: parseInt(e.target.value)
            })}
            className="w-full accent-indigo-600 dark:accent-indigo-400"
          />
        </div>

        <div className="space-y-3">
          {settings.type !== 'passphrase' && (
            <div className="flex items-center">
              <input
                type="checkbox"
                id="uppercase"
                checked={settings.includeUppercase}
                onChange={(e) => setSettings({
                  ...settings,
                  includeUppercase: e.target.checked
                })}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:focus:ring-indigo-400"
              />
              <label htmlFor="uppercase" className="ml-2 text-sm text-gray-700 dark:text-gray-200">
                Include Uppercase
              </label>
            </div>
          )}

          <div className="flex items-center">
            <input
              type="checkbox"
              id="numbers"
              checked={settings.includeNumbers}
              onChange={(e) => setSettings({
                ...settings,
                includeNumbers: e.target.checked
              })}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:focus:ring-indigo-400"
            />
            <label htmlFor="numbers" className="ml-2 text-sm text-gray-700 dark:text-gray-200">
              Include Numbers
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="symbols"
              checked={settings.includeSymbols}
              onChange={(e) => setSettings({
                ...settings,
                includeSymbols: e.target.checked
              })}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:focus:ring-indigo-400"
            />
            <label htmlFor="symbols" className="ml-2 text-sm text-gray-700 dark:text-gray-200">
              Include Symbols
            </label>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
            <span className="flex-grow font-mono text-lg text-gray-800 dark:text-gray-200">
              {loading ? 'Generating...' : password}
            </span>
            <button
              onClick={copyToClipboard}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              title="Copy to clipboard"
              disabled={loading}
            >
              📋
            </button>
            <button
              onClick={generatePassword}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              title="Generate new password"
              disabled={loading}
            >
              🔄
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
