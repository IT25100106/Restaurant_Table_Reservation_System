package com.restaurant.util;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.*;
import java.util.ArrayList;
import java.util.List;

@Component
public class FileHandler {

    // Static field used by all static methods
    private static String DATA_FOLDER = "data";

    // Injected from application.properties: app.data.path
    @Value("${app.data.path:data}")
    private String dataPath;

    /**
     * Called by Spring after injection — copies the configured path into the
     * static field so that all static helper methods pick it up automatically.
     */
    @PostConstruct
    public void init() {
        DATA_FOLDER = dataPath;
        System.out.println("[FileHandler] Data folder resolved to: "
                + new java.io.File(DATA_FOLDER).getAbsolutePath());
        ensureDataFolder();
    }

    public static final String SEPARATOR = "|";
    public static final String SEPARATOR_REGEX = "\\|";

    public static void ensureDataFolder() {
        File folder = new File(DATA_FOLDER);
        if (!folder.exists()) {
            folder.mkdirs();
            System.out.println("[FileHandler] Created data folder: " + folder.getAbsolutePath());
        }
    }


    public static List<String> readLines(String filename) {
        ensureDataFolder();
        List<String> lines = new ArrayList<>();
        File file = new File(DATA_FOLDER + File.separator + filename);

        if (!file.exists()) {
            return lines; // return empty list if file doesn't exist yet
        }

        try (BufferedReader reader = new BufferedReader(new FileReader(file))) {
            String line;
            while ((line = reader.readLine()) != null) {
                line = line.trim();
                if (!line.isEmpty() && !line.startsWith("#")) {
                    lines.add(line);
                }
            }
        } catch (IOException e) {
            System.err.println("[FileHandler] Error reading " + filename + ": " + e.getMessage());
        }

        return lines;
    }


    public static void writeLines(String filename, List<String> lines) {
        ensureDataFolder();
        File file = new File(DATA_FOLDER + File.separator + filename);

        try (BufferedWriter writer = new BufferedWriter(new FileWriter(file, false))) {
            for (String line : lines) {
                writer.write(line);
                writer.newLine();
            }
        } catch (IOException e) {
            System.err.println("[FileHandler] Error writing " + filename + ": " + e.getMessage());
        }
    }


    public static void appendLine(String filename, String line) {
        ensureDataFolder();
        File file = new File(DATA_FOLDER + File.separator + filename);

        try (BufferedWriter writer = new BufferedWriter(new FileWriter(file, true))) {
            writer.write(line);
            writer.newLine();
        } catch (IOException e) {
            System.err.println("[FileHandler] Error appending to " + filename + ": " + e.getMessage());
        }
    }

    public static boolean deleteLine(String filename, String id) {
        List<String> lines = readLines(filename);
        List<String> updated = new ArrayList<>();
        boolean found = false;

        for (String line : lines) {
            String[] parts = line.split(SEPARATOR_REGEX);
            if (parts.length > 0 && parts[0].equals(id)) {
                found = true; // skip this line (= delete it)
            } else {
                updated.add(line);
            }
        }

        if (found) {
            writeLines(filename, updated);
        }

        return found;
    }

    public static boolean updateLine(String filename, String id, String newLine) {
        List<String> lines = readLines(filename);
        boolean found = false;

        for (int i = 0; i < lines.size(); i++) {
            String[] parts = lines.get(i).split(SEPARATOR_REGEX);
            if (parts.length > 0 && parts[0].equals(id)) {
                lines.set(i, newLine);
                found = true;
                break;
            }
        }

        if (found) {
            writeLines(filename, lines);
        }

        return found;
    }


    public static String findById(String filename, String id) {
        for (String line : readLines(filename)) {
            String[] parts = line.split(SEPARATOR_REGEX);
            if (parts.length > 0 && parts[0].equals(id)) {
                return line;
            }
        }
        return null;
    }

    public static String generateNextId(String filename) {
        List<String> lines = readLines(filename);
        int maxId = 0;

        for (String line : lines) {
            String[] parts = line.split(SEPARATOR_REGEX);
            if (parts.length > 0) {
                try {
                    int id = Integer.parseInt(parts[0]);
                    if (id > maxId) maxId = id;
                } catch (NumberFormatException ignored) {}
            }
        }

        return String.valueOf(maxId + 1);
    }


    public static boolean existsById(String filename, String id) {
        return findById(filename, id) != null;
    }
}
