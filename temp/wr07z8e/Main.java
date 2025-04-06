import javax.swing.*;
import java.awt.*;
import java.awt.event.*;

public class Main extends JFrame {
    private JTextField nameField, rollField, cgpaField, emailField;
    private JComboBox<String> branchDropdown;
    private JLabel displayLabel;
    private JPanel panel;
    
    public Main() {
        setTitle("Student Registration");
        setSize(400, 350);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLayout(new GridLayout(7, 2, 5, 5));

        // Labels & Inputs
        add(new JLabel("Name:"));
        nameField = new JTextField();
        add(nameField);

        add(new JLabel("Roll No:"));
        rollField = new JTextField();
        add(rollField);

        add(new JLabel("CGPA:"));
        cgpaField = new JTextField();
        add(cgpaField);

        add(new JLabel("Branch:"));
        String[] branches = {"CSE", "IT", "CSCE", "CSSE"};
        branchDropdown = new JComboBox<>(branches);
        add(branchDropdown);

        add(new JLabel("Email ID:"));
        emailField = new JTextField();
        add(emailField);

        // Submit Button
        JButton submitButton = new JButton("Submit");
        submitButton.addActionListener(e -> validateAndSubmit());
        add(submitButton);

        // Reset Button
        JButton resetButton = new JButton("Reset");
        resetButton.addActionListener(e -> resetFields());
        add(resetButton);

        // Change Color Button
        JButton colorButton = new JButton("Change Color");
        colorButton.addActionListener(e -> toggleColor());
        add(colorButton);

        // Display Label
        displayLabel = new JLabel("", SwingConstants.CENTER);
        panel = new JPanel();
        panel.add(displayLabel);
        add(panel);

        setVisible(true);
    }

    private void validateAndSubmit() {
        String name = nameField.getText();
        String roll = rollField.getText();
        String cgpaText = cgpaField.getText();
        String email = emailField.getText();
        String branch = (String) branchDropdown.getSelectedItem();

        // Roll No Validation (7-8 digits)
        if (!roll.matches("\\d{7,8}")) {
            JOptionPane.showMessageDialog(this, "Roll No must be 7-8 digits!", "Error", JOptionPane.ERROR_MESSAGE);
            return;
        }

        // CGPA Validation (6.0 - 10.0)
        float cgpa;
        try {
            cgpa = Float.parseFloat(cgpaText);
            if (cgpa < 6.0 || cgpa > 10.0) {
                throw new NumberFormatException();
            }
        } catch (NumberFormatException ex) {
            JOptionPane.showMessageDialog(this, "CGPA must be between 6.0 and 10.0!", "Error", JOptionPane.ERROR_MESSAGE);
            return;
        }

        // Email Validation (basic format check)
        if (!email.matches("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$")) {
            JOptionPane.showMessageDialog(this, "Invalid Email format!", "Error", JOptionPane.ERROR_MESSAGE);
            return;
        }

        // Display Submitted Data
        displayLabel.setText("<html>Name: " + name + "<br>Roll No: " + roll + "<br>CGPA: " + cgpa + 
                            "<br>Branch: " + branch + "<br>Email: " + email + "</html>");
    }

    private void resetFields() {
        nameField.setText("");
        rollField.setText("");
        cgpaField.setText("");
        emailField.setText("");
        branchDropdown.setSelectedIndex(0);
        displayLabel.setText("");
    }

    private void toggleColor() {
        Color currentColor = getContentPane().getBackground();
        getContentPane().setBackground(currentColor == Color.GREEN ? Color.PINK : Color.GREEN);
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(Main::new);
    }
}
